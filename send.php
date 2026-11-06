
<?php
declare(strict_types=1);

/*
 * ヴァージンクリニック 女性医療脱毛LP
 * Xserver メール送信処理
 */

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

// ========================================
// 1. メール設定
// ========================================

// 送信先・送信元を確認するまで false のまま
const ENABLE_MAIL = false;

const FROM_EMAIL = 'reserve-flp@v-clinic.jp';

// 院別通知先
const CLINIC_EMAILS = [
    'kyoto' => 'contact@v-clinic.jp',
    'hiroshima' => 'reserve@hiroshima.v-clinic.jp',
    'fukuoka' => 'contact@fukuoka.v-clinic.jp',
];

const CLINIC_NAMES = [
    'kyoto' => '京都院',
    'hiroshima' => '広島院',
    'fukuoka' => '福岡天神院',
];

// ========================================
// 2. 共通処理
// ========================================

function response(
    int $status,
    bool $ok,
    string $message,
    array $extras = []
): never {
    http_response_code($status);

    echo json_encode(
        array_merge(
            ['ok' => $ok, 'message' => $message],
            $extras
        ),
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

function field(array $data, string $key, int $max): string {
    $value = $data[$key] ?? '';

    if (!is_string($value)) {
        response(422, false, '入力内容を確認してください。');
    }

    $value = trim(
        str_replace(["\r\n", "\r"], "\n", $value)
    );

    if (mb_strlen($value, 'UTF-8') > $max) {
        response(422, false, '入力文字数が上限を超えています。');
    }

    return $value;
}

function plain(string $value): string {
    return str_replace(
        ["\r", "\n", "\0"],
        ' ',
        $value
    );
}

// ========================================
// 3. セッション開始
// ========================================

if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode', '1');

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/ladies2/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

// ========================================
// 4. 送信トークン発行
// ========================================

if (
    $_SERVER['REQUEST_METHOD'] === 'GET'
    && ($_GET['mode'] ?? '') === 'token'
) {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    response(
        200,
        true,
        '',
        ['token' => $_SESSION['csrf_token']]
    );
}

// ========================================
// 5. リクエスト検証
// ========================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(405, false, '許可されていない操作です。');
}

if (!ENABLE_MAIL) {
    response(503, false, '現在、予約フォームは準備中です。');
}

if (
    stripos(
        (string)($_SERVER['CONTENT_TYPE'] ?? ''),
        'application/json'
    ) !== 0
) {
    response(415, false, '送信形式が正しくありません。');
}

if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 15000) {
    response(413, false, '入力内容が長すぎます。');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin && $origin !== 'https://v-clinic.jp') {
    response(403, false, '送信元を確認できません。');
}

$fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';

if (
    $fetchSite
    && !in_array($fetchSite, ['same-origin', 'none'], true)
) {
    response(403, false, '送信元を確認できません。');
}

// ========================================
// 6. JSON受信
// ========================================

$json = file_get_contents('php://input');
$data = json_decode((string)$json, true);

if (!is_array($data)) {
    response(400, false, '入力内容を読み取れません。');
}

// 迷惑送信対策：隠し項目
if (field($data, 'website', 300) !== '') {
    response(200, true, '');
}

// CSRFトークン確認
$token = field($data, 'csrf_token', 128);

if (
    empty($_SESSION['csrf_token'])
    || !hash_equals(
        (string)$_SESSION['csrf_token'],
        $token
    )
) {
    response(
        403,
        false,
        '送信画面の有効期限が切れました。再度お試しください。'
    );
}

// 90秒以内の連続送信を制限
if (
    isset($_SESSION['last_sent'])
    && time() - (int)$_SESSION['last_sent'] < 90
) {
    response(
        429,
        false,
        '連続送信はできません。少し時間を空けてください。'
    );
}

// 個人情報同意
if (field($data, 'privacyConsent', 5) !== 'on') {
    response(
        422,
        false,
        '個人情報の取扱いへの同意が必要です。'
    );
}

// ========================================
// 7. 入力値の取得
// ========================================

$clinic = field($data, 'clinic', 24);

if (!isset(CLINIC_EMAILS[$clinic])) {
    response(422, false, '医院を選択してください。');
}

$name = field($data, 'name', 80);
$age = field($data, 'age', 50);
$phone = field($data, 'phone', 24);
$email = field($data, 'email', 254);
$date = field($data, 'preferredDate', 10);
$time = field($data, 'preferredTime', 40);
$plan = field($data, 'plan', 100);
$message = field($data, 'message', 2000);

// 必須項目
if (
    $name === ''
    || $age === ''
    || $phone === ''
    || $email === ''
    || $date === ''
    || $time === ''
) {
    response(422, false, '必須項目を入力してください。');
}

// メールアドレス検証
if (
    !filter_var($email, FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n]/', $email)
) {
    response(422, false, 'メールアドレスを確認してください。');
}

// 電話番号検証
if (!preg_match('/^[0-9+()\-\s]{9,24}$/D', $phone)) {
    response(422, false, '電話番号を確認してください。');
}

// 希望日の検証
$timezone = new DateTimeZone('Asia/Tokyo');

$dt = DateTimeImmutable::createFromFormat(
    '!Y-m-d',
    $date,
    $timezone
);

if (
    !$dt
    || $dt->format('Y-m-d') !== $date
    || $dt < new DateTimeImmutable('today', $timezone)
) {
    response(422, false, 'ご希望日を確認してください。');
}

// ========================================
// 8. メール送信環境の確認
// ========================================

if (
    !filter_var(FROM_EMAIL, FILTER_VALIDATE_EMAIL)
    || !filter_var(
        CLINIC_EMAILS[$clinic],
        FILTER_VALIDATE_EMAIL
    )
) {
    response(503, false, 'メール設定を確認してください。');
}

if (!function_exists('mb_send_mail')) {
    response(
        503,
        false,
        'サーバーのメール機能が利用できません。'
    );
}

// ========================================
// 9. メール本文の作成
// ========================================

$clinicName = CLINIC_NAMES[$clinic];

$fields = [
    'ご希望院' => $clinicName,
    'お名前' => $name,
    'ご年齢' => $age,
    '電話番号' => $phone,
    'メールアドレス' => $email,
    'ご希望日' => $date,
    'ご希望時間帯' => $time,
    'ご興味のあるプラン' => $plan ?: '未指定',
    'ご質問・ご要望' => $message ?: 'なし',
];

$summary = '';

foreach ($fields as $label => $value) {
    $summary .= $label . '：' . $value . "\n";
}

mb_language('Japanese');
mb_internal_encoding('UTF-8');

$headers =
    'From: ' . FROM_EMAIL . "\r\n"
    . 'Reply-To: ' . FROM_EMAIL . "\r\n"
    . 'X-Mailer: VirginClinic-LP';

// ========================================
// 10. 医院への通知メール
// ========================================

$adminSubject =
    '【新規予約希望】'
    . $clinicName
    . ' / '
    . plain($name)
    . ' 様';

$adminBody =
    "女性医療脱毛LPから予約希望が届きました。\n"
    . "予約確定ではありません。\n"
    . "担当者から折り返しご連絡ください。\n\n"
    . $summary;

$sent = mb_send_mail(
    CLINIC_EMAILS[$clinic],
    $adminSubject,
    $adminBody,
    $headers
);

if (!$sent) {
    response(
        502,
        false,
        '受付メールの送信に失敗しました。時間をおいてお試しください。'
    );
}

// ========================================
// 11. 二重送信対策
// ========================================

$_SESSION['last_sent'] = time();
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// ========================================
// 12. 申込者への自動返信
// ========================================

$replySubject =
    '【予約希望受付】ヴァージンクリニック';

$replyBody =
    plain($name) . " 様\n\n"
    . "お申し込みありがとうございます。\n"
    . "予約希望を受け付けました。\n"
    . "現時点では予約は確定しておりません。\n"
    . "担当スタッフからの連絡をお待ちください。\n\n"
    . "【お申し込み内容】\n"
    . $summary
    . "\n※こちらは自動送信メールです。\n"
    . "ヴァージンクリニック\n";

$replySent = mb_send_mail(
    $email,
    $replySubject,
    $replyBody,
    $headers
);

// ========================================
// 13. 結果を返す
// ========================================

// 自動返信に失敗しても、医院への通知が成功していれば
// 受付成功として扱い、重複申込を防止する。

response(
    200,
    true,
    '予約希望を受け付けました。',
    ['autoReplySent' => $replySent]
);
