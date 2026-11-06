    ini_set('session.use_strict_mode','1');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/ladies2/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']);
    session_start();
}
if ($_SERVER['REQUEST_METHOD']==='GET' && ($_GET['mode']??'')==='token') {
    if (!isset($_SESSION['csrf_token'])) $_SESSION['csrf_token']=bin2hex(random_bytes(32));
    response(200,true,'',['token'=>$_SESSION['csrf_token']]);
}
if ($_SERVER['REQUEST_METHOD']!=='POST') response(405,false,'許可されていない操作です。');
if (!ENABLE_MAIL) response(503,false,'現在、予約フォームは準備中です。');
if (stripos((string)($_SERVER['CONTENT_TYPE']??''),'application/json')!==0) response(415,false,'送信形式が正しくありません。');
if ((int)($_SERVER['CONTENT_LENGTH']??0)>15000) response(413,false,'入力内容が長すぎます。');
$origin=$_SERVER['HTTP_ORIGIN']??'';
if ($origin && $origin !== 'https://v-clinic.jp') response(403,false,'送信元を確認できません。');
$fetchSite=$_SERVER['HTTP_SEC_FETCH_SITE']??'';
if ($fetchSite && !in_array($fetchSite,['same-origin','none'],true)) response(403,false,'送信元を確認できません。');
$json=file_get_contents('php://input');
$data=json_decode((string)$json,true);
if (!is_array($data)) response(400,false,'入力内容を読み取れません。');
if (field($data,'website',300)!=='') response(200,true,''); // bot honeypot
$token=field($data,'csrf_token',128);
if (empty($_SESSION['csrf_token']) || !hash_equals((string)$_SESSION['csrf_token'],$token)) response(403,false,'送信画面の有効期限が切れました。再度お試しください。');
if (isset($_SESSION['last_sent']) && time()-(int)$_SESSION['last_sent']<90) response(429,false,'連続送信はできません。少し時間を空けてください。');
if (field($data,'privacyConsent',5)!=='on') response(422,false,'個人情報の取扱いへの同意が必要です。');
$clinic=field($data,'clinic',24);
if (!isset(CLINIC_EMAILS[$clinic])) response(422,false,'医院を選択してください。');
$name=field($data,'name',80); $age=field($data,'age',50);
$phone=field($data,'phone',24); $email=field($data,'email',254);
$date=field($data,'preferredDate',10); $time=field($data,'preferredTime',40);
$plan=field($data,'plan',100); $message=field($data,'message',2000);
if ($name===''||$age===''||$phone===''||$email===''||$date===''||$time==='') response(422,false,'必須項目を入力してください。');
if (!filter_var($email,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/',$email)) response(422,false,'メールアドレスを確認してください。');
if (!preg_match('/^[0-9+()\-\s]{9,24}$/D',$phone)) response(422,false,'電話番号を確認してください。');
$dt=DateTimeImmutable::createFromFormat('!Y-m-d',$date,new DateTimeZone('Asia/Tokyo'));
if (!$dt || $dt->format('Y-m-d')!==$date || $dt < new DateTimeImmutable('today',new DateTimeZone('Asia/Tokyo'))) response(422,false,'ご希望日を確認してください。');
if (!filter_var(FROM_EMAIL,FILTER_VALIDATE_EMAIL) || !filter_var(CLINIC_EMAILS[$clinic],FILTER_VALIDATE_EMAIL)) response(503,false,'メール設定を確認してください。');
if (!function_exists('mb_send_mail')) response(503,false,'サーバーのメール機能が利用できません。');

$clinicName=CLINIC_NAMES[$clinic];
$fields=[
 'ご希望院'=>$clinicName,'お名前'=>$name,'ご年齢'=>$age,
 '電話番号'=>$phone,'メールアドレス'=>$email,
 'ご希望日'=>$date,'ご希望時間帯'=>$time,
 'ご興味のあるプラン'=>$plan?:'未指定','ご質問・ご要望'=>$message?:'なし'
];
$summary=''; foreach ($fields as $label=>$value) $summary.=$label."：".$value."\n";
mb_language('Japanese'); mb_internal_encoding('UTF-8');
$headers='From: '.FROM_EMAIL."\r\n".'Reply-To: '.FROM_EMAIL."\r\n".'X-Mailer: VirginClinic-LP';
$adminSubject='【新規予約希望】'.$clinicName.' / '.plain($name).' 様';
$adminBody="女性医療脱毛LPから予約希望が届きました。\n予約確定ではありません。担当者から折り返しご連絡ください。\n\n".$summary;
// 管理者通知に成功した場合のみ、自動返信処理へ進める。
$sent=mb_send_mail(CLINIC_EMAILS[$clinic],$adminSubject,$adminBody,$headers);
if (!$sent) response(502,false,'受付メールの送信に失敗しました。時間をおいてお試しください。');
$_SESSION['last_sent']=time();
$_SESSION['csrf_token']=bin2hex(random_bytes(32));
$replySubject='【予約希望受付】ヴァージンクリニック';
$replyBody=plain($name)." 様\n\nお申し込みありがとうございます。\n予約希望を受け付けました。現時点では予約は確定しておりません。\n担当スタッフからの連絡をお待ちください。\n\n【お申し込み内容】\n".$summary."\n※こちらは自動送信メールです。\nヴァージンクリニック\n";
$replySent=mb_send_mail($email,$replySubject,$replyBody,$headers);
// 自動返信が失敗しても、受付自体は成功扱い。重複申込を防ぐ。
response(200,true,'予約希望を受け付けました。', ['autoReplySent'=>$replySent]);
