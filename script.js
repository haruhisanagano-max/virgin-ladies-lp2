'use strict';
const D=window.CONTENT;
const safe=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const lines=s=>safe(s).replace(/\n/g,'<br>');
const campaignName=s=>{const m=s.match(/^(.+?)[ 　]+([5５]回コース.*)$/);return m?'<span>'+safe(m[1])+'</span><small>'+safe(m[2])+'</small>':safe(s)};
const heading=(a,cls='')=>`<h2 class="headline ${cls}"><span>${lines(a[0])}</span><strong>${lines(a[1])}</strong></h2>`;
const note=s=>`<p class="fine">${safe(s)}</p>`;
const sourceNote=()=>'';
const arrow='<span class="ui-arrow" aria-hidden="true"></span>';
const image=(src,alt,role='',cls='')=>`<img src="${safe(src)}" alt="${safe(alt)}" class="${cls}" data-image-role="${safe(role)}" loading="lazy">`;
const photo=(src,alt,role='',cls='')=>`<figure class="photo-window ${cls}">${image(src,alt,role)}</figure>`;
const brand=()=>`<span class="brand-lockup"><img class="brand-logo" src="${safe(D.brand.logo)}" alt="${safe(D.brand.name)}" width="210" height="53"></span>`;
const invitation=(where)=>`<div class="invitation" data-location="${where}"><span class="cta-overline">${safe(D.cta.overline)}</span><button type="button" class="button-primary" data-to-reservation><span><small>${safe(D.cta.small)}</small><b>${safe(D.cta.main)}</b><em>${safe(D.cta.caption)}</em></span>${arrow}</button><button type="button" class="button-line" data-line><span>${safe(D.cta.line)}<small>ご希望の院を選択</small></span>${arrow}</button>${note(D.cta.note)}</div>`;
const onlineButton=()=>`<button type="button" class="booking-line" data-online><span>${safe(D.invitation.onlineButtonText)}<small>ご予約手順を見る</small></span>${arrow}</button>`;
function campaignPlan(p,i){return `<article class="quantity-plan campaign-plan quantity-${i}"><div class="plan-top"><h3>${campaignName(p.name)}</h3></div><div class="campaign-money"><small>通常価格 <s>¥${safe(p.originalPrice)}</s></small><p><span>¥</span><b>${safe(p.campaignPrice)}</b><small>${safe(p.taxLabel)}</small></p><span class="offer-label">${safe(p.discountBadge)}</span></div>${p.features?`<div class="campaign-perks">${p.features.map((s,j)=>`<p><span>${String(j+1).padStart(2,'0')}</span>${safe(s)}</p>`).join('')}</div>`:''}</article>`}
function course(p,i){return `<article class="course-spread course-${i}"><header><div><h3>${safe(p.name)}</h3><p>${safe(p.subtitle)}</p></div></header><div class="course-hero-price"><p>${safe(p.sessions)}</p><small>通常価格 <s>¥${safe(p.originalPrice)}</s></small><div><span>¥</span><b>${safe(p.campaignPrice)}</b><small>${safe(p.taxLabel)}</small></div></div><div class="course-inclusions">${photo(p.treatmentImage,p.name+'の施術対象部位','coverage','coverage-photo')}<div><h4>照射範囲</h4>${p.features.map(s=>`<p>${safe(s)}</p>`).join('')}</div></div><p class="course-single">都度払い <strong>¥${safe(p.monthlyPrice)}</strong> <small>${safe(p.taxLabel)}</small></p><button class="button-primary course-button" type="button" data-to-reservation data-form-plan="${i}"><span><small>${safe(p.sessions)}</small><b>${safe(p.buttonText)}</b></span>${arrow}</button></article>`}
function clinicPanel(c){return `<div class="clinic-spread clinic-${safe(c.id)}"><div class="clinic-compact-head">${photo(c.mainImage,c.name+'の実際の院内写真','clinic-'+c.id)}<div><small>ヴァージンクリニック</small><h3>${safe(c.name)}</h3><p>${safe(c.nearestStation)}</p></div></div><div class="clinic-details"><div class="clinic-gallery">${c.gallery.map(g=>`<figure>${image(g.url,c.name+' '+g.label,'clinic-'+c.id)}<figcaption>${safe(g.label)}</figcaption></figure>`).join('')}</div><dl>${[['所在地',c.zipCode+' '+c.address],['アクセス',c.access.join('\n')],['診療時間',c.hours.weekday+'\n'+c.hours.weekend],['休診日',c.hours.closed],['電話番号',c.phone]].map(([k,v])=>`<div><dt>${safe(k)}</dt><dd>${safe(v)}</dd></div>`).join('')}</dl><div class="clinic-map"><iframe src="${safe(c.mapIframeUrl)}" title="${safe(c.fullName)}のGoogleマップ" width="342" height="230" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe></div><a class="map-link" href="${safe(window.LP_LINKS.resolve(c.mapPageUrl))}" target="_blank" rel="noopener noreferrer"><span>Googleマップで開く</span>${arrow}</a><details class="copy-details"><summary>${safe(c.fullName)}について</summary><p>${safe(c.description1)}</p><p>${safe(c.description2)}</p><p>当院は完全予約制の上質な空間です。スムーズなご案内のため、事前のご予約をお願いしております。</p></details><button type="button" class="clinic-reserve" data-to-reservation data-reserve-clinic="${safe(c.id)}"><span><small>無料来院予約</small>${safe(c.name)}の相談・予約へ</span>${arrow}</button></div></div>`}
const onlineSteps=()=>`<ol class="flow-story online-steps">${D.invitation.remoteStep.steps.map(x=>`<li><span class="flow-icon"><b>${safe(x.num)}</b></span><h3>${safe(x.title)}</h3><p>${safe(x.desc)}</p></li>`).join('')}</ol><div class="price-dose"><small>送信メッセージの例</small><p class="message-example">${safe(D.invitation.remoteStep.messageToSend)}</p></div>`;
document.querySelector('#page').innerHTML=`

<header class="masthead" id="top"><a class="wordmark" href="#top">${brand()}</a><span class="menu-label">ヴァージンクリニック<br>女性医療脱毛</span></header>
<section id="hero" class="hero"><div class="hero-scene" style="--hero-ratio:${safe(D.hero.imageRatio)};--hero-fit:${safe(D.hero.imageFit)};--hero-position:${safe(D.hero.imagePosition)}"><img class="hero-image" src="${safe(D.images.hero)}" alt="${safe(D.hero.caption)}" data-image-role="beauty" width="1024" height="1536" fetchpriority="high"></div></section>
<nav class="jump-links" aria-label="ページ内ナビゲーション">${[['campaign','キャンペーン'],['machine','機器'],['pricing','料金'],['clinic','医院'],['reservation','予約']].map(([id,s])=>`<a href="#${id}">${s}${arrow}</a>`).join('')}</nav>
<section id="campaign" class="pricing campaign"><span class="ambient-art ambient-film" aria-hidden="true"></span><div class="section-pad">${heading(['初回特別キャンペーン','GentleMax Pro確約'])}<p class="body-copy">${safe(D.campaign.subtitle)}</p><div class="quantity-plans">${D.campaign.plans.map(campaignPlan).join('')}</div><div class="conditions-ribbon"><h3>キャンペーンのご案内</h3>${D.campaign.notes.map((s,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h4>${safe(D.editorial.conditions[i])}</h4><p>${safe(s)}</p></div></article>`).join('')}</div>${sourceNote()}<button class="button-primary" type="button" data-to-reservation><span><small>無料カウンセリング</small><b>${safe(D.campaign.buttonText)}</b></span>${arrow}</button></div></section>

<section id="concerns" class="concerns"><span class="ambient-art ambient-ribbon" aria-hidden="true"></span><div class="section-pad">${heading(['毎日のムダ毛処理、','こんなお悩み、ありませんか？'])}<div class="concern-editorial"><p class="concern-lead">そのお手入れ、<br><strong>そろそろ変えたい。</strong></p><div class="concern-mosaic">${D.editorial.concerns.map((x,i)=>`<article><span class="mosaic-index">${String(i+1).padStart(2,'0')}</span><p>${lines(x)}</p></article>`).join('')}</div><p class="concern-signature">素肌と、<span>わたしの時間。</span></p></div><p class="body-copy">${safe(D.concerns.lead)}</p></div></section>
<section id="transformation" class="evidence transformation"><div class="section-pad">${heading(D.transformation.heading)}<p class="body-copy">${safe(D.transformation.lead)}</p><div class="skin-manifesto">${photo(D.images.skin,'生成した素肌の美容イメージ。症例ではありません','beauty')}<p class="skin-copy-first">自信のある、</p><p class="skin-copy-second">素肌へ</p></div><div class="source-stats">${D.transformation.stats.map(x=>`<div><small>${safe(x.label)}</small><p><b>${safe(x.value)}</b><span>${safe(x.unit)}</span></p></div>`).join('')}${D.transformation.steps.map((x,i)=>`<article class="progress-spread progress-${i}"><div class="progress-position"><span>${String(i+1).padStart(2,'0')}</span><p>${safe(x.session)}</p></div><figure>${image(x.image,x.session+'の肌断面イメージ。症例・効果保証ではありません','skin-diagram')}<figcaption><small>${safe(x.session)}</small><h3>${lines(D.editorial.progress[i].heading)}</h3></figcaption></figure><div class="progress-copy"><p>${safe(D.editorial.progress[i].summary)}</p><details class="copy-details"><summary>タップして詳細を見る</summary><p>${safe(x.description)}</p></details></div></article>`).join('')}</div>${note(D.transformation.note)}${sourceNote()}</div></section>
<section id="selection" class="reviews"><div class="section-pad"><p class="chapter-label">ご検討の参考に</p>${heading(['患者様からの評価を、','ひとつの判断材料に。'])}<p class="review-disclosure">${safe(D.reviews.note)}</p></div><div class="review-slider"><div class="reviews-viewport" tabindex="0" aria-label="媒体評価・横にスライド">${D.reviews.items.map((x,i)=>`<article class="review-slide" aria-label="${i+1}件目 ${safe(x.name)}"><header><h3>${safe(x.name)}</h3></header><div class="star-score"><span class="rating-stars" style="--rating:${Number(x.rating)/5*100}%" aria-hidden="true"></span><p><strong>${safe(x.rating)}</strong><span>／5</span></p></div><p class="review-count">掲載件数 <b>${safe(x.total)}</b> 件</p><div class="review-cities">${x.details.map(v=>`<p><span>${safe({KYOTO:'京都',HIROSHIMA:'広島',FUKUOKA:'福岡'}[v.city]||v.city)}</span><b>${safe(v.rating)}</b></p>`).join('')}</div></article>`).join('')}</div><div class="review-controls"><button type="button" class="slider-prev" aria-label="前の評価へ">${arrow}</button><div class="review-pagination" role="group" aria-label="評価の表示切替">${D.reviews.items.map((_,i)=>`<button type="button" data-review-index="${i}" aria-label="${i+1}件目の評価" aria-pressed="${i===0}"></button>`).join('')}</div><p class="review-current" aria-live="polite">1 / ${D.reviews.items.length}</p><button type="button" class="slider-next" aria-label="次の評価へ">${arrow}</button></div></div></section>
<section id="machine" class="about machine"><div class="section-pad"><p class="chapter-label">ジェントルマックスプロ</p>${heading(D.machine.heading)}</div><div class="machine-editorial"><p class="machine-aside">${safe(D.machine.badge)}</p><div class="product-halo" aria-hidden="true"></div>${photo(D.images.machine,'ジェントルマックスプロのイメージ画像','machine','device-portrait')}<div class="device-waves"><span>肌・毛に合わせる</span><p><b>755</b><small>nm</small></p><p><b>1064</b><small>nm</small></p></div><div class="device-spec-strip"><span>熱破壊式</span><span>2波長</span><span>DCD冷却</span></div></div><div class="section-pad"><div class="wave-spreads">${D.machine.waves.map((x,i)=>`<article><span class="wave-number">${safe(x.wavelength)}</span><h3>${safe(x.name)}</h3><p class="wave-target">${safe(x.target)}</p><p>${safe(x.feature)}</p><div class="wave-points">${x.points.map(s=>`<span>${safe(s)}</span>`).join('')}</div></article>`).join('')}</div><div class="machine-claims">${D.machine.claims.map((s,i)=>`<p><span>${String(i+1).padStart(2,'0')}</span>${safe(s)}</p>`).join('')}</div>${sourceNote()}<div class="feature-compositions">${D.machine.features.map((x,i)=>`<article class="feature-spread feature-${i}"><header><span>${String(i+1).padStart(2,'0')}</span><h3>${lines(D.editorial.features[i].heading)}</h3></header><figure>${image(x.img,x.title+'の概念図（生成画像・模式表現）','mechanism-diagram')}<figcaption>${safe(D.editorial.features[i].tag)}</figcaption></figure><div class="feature-copy"><p>${safe(D.editorial.features[i].summary)}</p><details class="copy-details"><summary>タップして詳細を見る</summary><p>${safe(x.desc)}</p></details></div></article>`).join('')}</div><div class="machine-notices">${D.machine.notices.map(note).join('')}</div></div></section>
<section id="middle" class="middle-invite">${image(D.images.ring,'虹色のホログラム抽象アート','decoration')}<div class="middle-copy"><p class="chapter-label">お問合せ・無料カウンセリング</p>${heading(['『お問合せ』','『無料カウンセリング』'])}<p>無料来院予約・オンライン診療</p>${invitation('middle')}${onlineButton()}</div></section>
<section id="pain" class="usage pain"><div class="section-pad">${heading(['「痛みが心配で」','あきらめていた方へ。'])}<p class="care-intro">冷却の技術と、<br><em>一人ひとりへの配慮を。</em></p></div><div class="care-promise"><figure>${image(D.pain.items[0].image,'DCD冷却システムの概念図（生成画像・模式表現）','cooling-diagram')}<figcaption><span>照射直前の冷却</span><strong>−26<small>℃</small></strong><p>DCD冷却システム</p></figcaption></figure><div class="care-chapters"><article><span>冷やして守る</span><p>照射の直前に<br><b>皮膚表面を冷却。</b></p></article><article><span>無理をしない</span><p>感じ方に合わせて<br><b>出力・照射を調整。</b></p></article><article><span>麻酔も相談</span><p>痛みの不安を、<br><b>事前にお聞かせください。</b></p></article></div></div><div class="section-pad"><p class="care-invitation">「痛みが心配で脱毛を諦めていた」<br>という方も、ぜひ一度ご相談ください。</p><p class="fine">${safe(D.pain.note)}</p><details class="copy-details cooling-details"><summary>DCD冷却・痛みへの配慮について</summary>${D.pain.items.map(x=>`<h3>${safe(x.title)}</h3><p>${safe(x.subTitle)}</p><p>${safe(x.description)}</p>`).join('')}<p>${safe(D.pain.intro)}${safe(D.pain.adjust)}</p></details>${sourceNote()}</div></section>
<section id="comparison" class="comparison"><div class="section-pad">${heading(D.comparison.heading)}<table><thead><tr>${D.comparison.columns.map(s=>`<th scope="col">${safe(s)}</th>`).join('')}</tr></thead><tbody>${D.comparison.rows.map(x=>`<tr><th scope="row">${safe(x.label)}</th><td>${safe(x.us)}</td><td>${safe(x.others)}</td></tr>`).join('')}</tbody></table><p class="body-copy">${safe(D.comparison.conclusion)}</p>${sourceNote()}</div></section>
<section id="zero-yen" class="usage fees"><span class="ambient-art ambient-tides" aria-hidden="true"></span><div class="section-pad"><p class="chapter-label">費用の不安を、少しでも。</p><div class="zero-editorial"><h2><span>6つの追加料金</span><strong><b>0</b><span>円</span></strong></h2><p>初めての相談から、<br>施術のあとまで。</p></div><div class="zero-grid">${D.fees.items.map((s,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><h3>${safe(s)}</h3></article>`).join('')}</div><p class="zero-message">強引な勧誘や、不透明な追加費用のない<br><strong>明朗会計をお約束します。</strong></p><details class="copy-details"><summary>費用に関するご案内</summary><p class="pre-line">${safe(D.fees.message)}</p><p class="pre-line">${safe(D.fees.conclusion)}</p></details>${sourceNote()}</div></section>
<section id="pricing" class="pricing courses"><span class="ambient-art ambient-film" aria-hidden="true"></span><div class="section-pad">${heading(['範囲で選ぶ、','わたしの脱毛プラン。'])}<p class="course-overview">全身3プラン／すべて税込<br>5回コース</p><div class="course-editorial">${D.pricing.plans.map(course).join('')}</div><h3 class="small-heading">部位別プラン</h3><table class="parts-table"><thead><tr>${D.pricing.partHeaders.map(s=>`<th scope="col">${safe(s)}</th>`).join('')}</tr></thead><tbody>${D.pricing.parts.map(x=>`<tr><th scope="row">${safe(x.name)}</th><td>¥${safe(x.price)}</td><td>${x.monthly&&x.monthly!=='-'?'¥'+safe(x.monthly):safe(x.monthly||'—')}</td></tr>`).join('')}</tbody></table>${sourceNote()}</div></section>
<section id="clinic" class="clinics clinic-condensed"><span class="ambient-art ambient-dust" aria-hidden="true"></span><div class="section-pad clinic-opening">${heading(['はじめての脱毛も、','相談しやすい場所へ。'])}</div><div class="section-pad doctor-condensed"><div class="doctor-head">${photo(D.images.doctor,D.doctor.name+'の医師イラスト','doctor')}<div><small>${safe(D.doctor.role)}</small><h3>${safe(D.doctor.name)}</h3></div></div><p class="doctor-short">${safe(D.editorial.doctorShort)}</p><details class="copy-details"><summary>院長メッセージを読む</summary><p>${safe(D.doctor.message)}</p></details><div class="clinic-reason-notes">${D.reasons.map((x,i)=>`<article>${image(x.illustration,x.title+'のイメージイラスト（実在のスタッフ・院内写真ではありません）','illustration','reason-art')}<div><h3>${safe(x.title)}</h3><p>${safe(x.desc)}</p></div></article>`).join('')}</div><p class="reason-art-note">イラストはイメージです。</p></div><div class="clinic-tabs" role="tablist" aria-label="医院を選択">${D.clinics.map((c,i)=>`<button type="button" role="tab" id="tab-${c.id}" aria-controls="clinic-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-clinic="${c.id}">${safe(c.name)}</button>`).join('')}</div><div id="clinic-panel" role="tabpanel" aria-labelledby="tab-kyoto">${clinicPanel(D.clinics[0])}</div></section>
<section id="final" class="final"><p class="closing-prelude">お問合せ・無料カウンセリング</p><div class="closing-scene">${image(D.images.closing,'虹色の光と水面の抽象アート','decoration')}<div>${heading(['自信のある、素肌へ。','はじめの一歩は、\n相談から。'])}</div></div><div class="section-pad">${invitation('final')}${onlineButton()}</div></section>
<section id="flow" class="flow"><span class="ambient-art ambient-tides" aria-hidden="true"></span><div class="flow-heading section-pad">${heading(D.flow.heading)}</div><div class="section-pad"><ol class="flow-story">${D.flow.steps.map(x=>`<li><span class="flow-icon"><b>${safe(x.number.padStart(2,'0'))}</b></span><h3>${safe(x.title)}</h3><p>${safe(x.description)}</p></li>`).join('')}</ol></div></section>
<section id="faq" class="faq"><div class="section-pad"><div class="faq-head">${heading(D.faq.heading)}<span aria-hidden="true">Q</span></div>${D.faq.items.map((v,i)=>`<details class="question-item"><summary class="question"><span>Q<small>${String(i+1).padStart(2,'0')}</small></span><h3>${safe(v.question)}</h3><span class="faq-toggle" aria-hidden="true"></span></summary><div class="answer"><span>A</span><p>${safe(v.answer)}</p></div></details>`).join('')}</div></section>
<section id="reservation" class="reservation"><div class="section-pad">${heading(D.form.heading)}<p class="booking-lead">ご入力いただいた個人情報は、カウンセリング予約のご連絡および当院からの案内のみに使用します。第三者への提供は一切行いません。</p><form id="booking-form" novalidate><fieldset><legend>無料カウンセリング予約フォーム</legend><label>ご希望の医院<select name="clinic" required><option value="">院を選択してください</option>${D.clinics.map(c=>`<option value="${c.id}">${safe(c.name)}</option>`).join('')}</select></label><label>お名前<input name="name" type="text" autocomplete="name" required maxlength="80" placeholder="お名前"></label><label>ご年齢<select name="age" required><option value="">年齢を選択してください</option>${D.form.ageOptions.map(s=>`<option>${safe(s)}</option>`).join('')}</select></label><div class="form-two"><label>電話番号<input name="phone" type="tel" autocomplete="tel" required maxlength="24" placeholder="090-0000-0000"></label><label>メールアドレス<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="mail@example.com"></label></div><label>ご希望日<input name="preferredDate" type="date" required></label><label>ご希望時間帯<select name="preferredTime" required><option value="">選択してください</option>${D.form.timeOptions.map(s=>`<option>${safe(s)}</option>`).join('')}</select></label><label>ご興味のあるプラン<select name="plan"><option value="">プランを選択してください</option>${D.form.planOptions.map(s=>`<option>${safe(s)}</option>`).join('')}</select></label><label>ご質問・ご要望<textarea name="message" rows="3" maxlength="2000" placeholder="ご質問・ご要望"></textarea></label><label class="privacy-confirm"><input type="checkbox" name="privacyConsent" required>個人情報の取扱いを確認しました。</label><button class="button-primary" type="submit"><span><small></small><b>入力内容を確認する</b></span>${arrow}</button><p class="fine form-state" role="status"></p></fieldset></form></div></section>

<!-- 医療レーザー脱毛に関する注意事項 -->
<section class="medical-disclosure" aria-labelledby="medical-disclosure-title">
  <div class="medical-disclosure-box">

    <h2 id="medical-disclosure-title">
      医療レーザー脱毛（自由診療）に関するご案内
    </h2>

    <div class="medical-disclosure-item">
      <h3>治療内容</h3>
      <p>
        医療用レーザーを照射し、毛根組織を破壊することで長期的な減毛・脱毛を行う施術です。
        当院では厚生労働省承認機器（ジェントルマックスプロ）を使用しています。
        ※保険適用外の自由診療となります。
      </p>
    </div>

    <div class="medical-disclosure-item">
      <h3>標準的な回数・期間の目安</h3>
      <p>
        5回〜8回程度（期間：約1年〜1年半）
        <br>※効果や必要な回数、期間には個人差があります。
      </p>
    </div>

    <div class="medical-disclosure-item">
      <h3>費用の目安</h3>
      <p>
       ご希望の部位や回数により異なります。
       <br>ページ内の「料金表」にて各プランの標準的な費用を明記しておりますので、そちらをご参照ください。
       
      </p>
    </div>

    <div class="medical-disclosure-item">
      <h3>主なリスク・副作用について</h3>
      <p>
        ・レーザー照射により、一時的な発赤（赤み）、熱感、ヒリヒリ感が生じる場合があります。
        <br>・肌質や部位により、毛嚢炎（ニキビのような症状）、一時的な色素沈着、軽度のやけど（熱傷）が生じる可能性があります。
        <br>・稀に、レーザーの刺激によりかえって毛が太く・濃くなること（増毛化・硬毛化）があります。
      </p>
      <p>
        ※施術後に肌トラブルが生じた場合は、速やかに医師が診察し、お薬の処方など適切な処置を行います。
      </p>
    </div>

  </div>
</section>

<footer><a class="wordmark" href="#top">${brand()}</a><p class="footer-warning">${safe(D.site.notice)}</p><nav aria-label="フッターナビゲーション"><a href="#machine">機器について</a><a href="#pricing">料金</a><a href="#clinic">医院案内</a><a href="#faq">よくあるご質問</a></nav><small class="copyright">© VIRGIN CLINIC</small></footer>
<div class="fixed-invite"><button type="button" data-line>LINE相談<small>ご希望の院へ</small></button><button type="button" data-to-reservation><small>全身脱毛 ¥${safe(D.hero.price)}（税込）※都度払いもキャンペーン価格適応</small><b>カウンセリング予約 ${arrow}</b></button></div>
<dialog id="line-dialog" aria-labelledby="line-title" aria-describedby="line-description"><div class="line-modal-head"><p>ヴァージンクリニック</p><button type="button" class="dialog-close"><span class="close-lines" aria-hidden="true"></span>閉じる</button></div><h2 id="line-title"><span>ご希望の院を</span><span>お選びください。</span></h2><p id="line-description">各院の公式LINEからご相談いただけます。</p><div class="line-clinic-list">${D.clinics.map((c,i)=>`<article><div class="line-clinic-name"><span>${String(i+1).padStart(2,'0')}</span><h3>${safe(c.name)}</h3></div><a class="clinic-action" href="${safe(window.LP_LINKS.resolve(c.lineUrl,'line'))}" target="_blank" rel="noopener noreferrer"><span>LINEで相談する<small>${safe(c.name)}</small></span>${arrow}</a></article>`).join('')}</div></dialog>
<dialog id="online-dialog" class="aux-dialog" aria-labelledby="online-title"><div class="line-modal-head"><p>オンライン診療</p><button type="button" class="dialog-close"><span class="close-lines" aria-hidden="true"></span>閉じる</button></div><h2 id="online-title">${safe(D.invitation.remoteStep.title)}</h2>${onlineSteps()}<button class="button-line" type="button" data-online-line><span>ご希望の院のLINEへ</span>${arrow}</button></dialog>
<dialog id="confirm-dialog" class="aux-dialog" aria-labelledby="confirm-title"><div class="line-modal-head"><p>無料カウンセリング</p><button type="button" class="dialog-close"><span class="close-lines" aria-hidden="true"></span>戻る</button></div><h2 id="confirm-title">入力内容の確認</h2><dl class="fee-conditions" id="confirm-fields"></dl><p class="fine" id="confirm-status">内容をご確認のうえ、送信してください。送信時点では予約は確定しません。</p><button class="button-primary" type="button" data-send-booking><span><small>予約希望のお申し込み</small><b>この内容で送信する</b></span>${arrow}</button></dialog>`;

// The same tab / modal / scroll behavior as the supplied Upneeq template.
const form=document.querySelector('#booking-form');
function gotoForm(clinicId,planIndex){if(clinicId)form.elements.clinic.value=clinicId;if(planIndex!==undefined)form.elements.plan.value=D.form.planOptions[Number(planIndex)];document.querySelector('#reservation').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
function bindReservation(scope=document){scope.querySelectorAll('[data-to-reservation]').forEach(b=>b.addEventListener('click',()=>gotoForm(b.dataset.reserveClinic,b.dataset.formPlan)))}bindReservation();
const tabs=[...document.querySelectorAll('[data-clinic]')];
function chooseClinic(id,focus=false){const c=D.clinics.find(x=>x.id===id);if(!c)return;tabs.forEach(b=>{const active=b.dataset.clinic===id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus()});const panel=document.querySelector('#clinic-panel');panel.innerHTML=clinicPanel(c);panel.setAttribute('aria-labelledby','tab-'+id);bindReservation(panel);bindImageErrors(panel)}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>chooseClinic(b.dataset.clinic));b.addEventListener('keydown',ev=>{let n;if(ev.key==='ArrowRight')n=(i+1)%tabs.length;if(ev.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(ev.key==='Home')n=0;if(ev.key==='End')n=tabs.length-1;if(n!==undefined){ev.preventDefault();chooseClinic(tabs[n].dataset.clinic,true)}})});
let opener=null;const lineDialog=document.querySelector('#line-dialog'),onlineDialog=document.querySelector('#online-dialog'),confirmDialog=document.querySelector('#confirm-dialog');
function openModal(dialog,button){opener=button;dialog.showModal();document.documentElement.classList.add('modal-open');dialog.querySelector('.dialog-close').focus()}
for(const dialog of [lineDialog,onlineDialog,confirmDialog]){dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',ev=>{const r=dialog.getBoundingClientRect();if(ev.target===dialog&&(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom))dialog.close()});dialog.addEventListener('close',()=>{document.documentElement.classList.remove('modal-open');opener?.focus()})}
document.querySelectorAll('[data-line]').forEach(b=>b.addEventListener('click',()=>openModal(lineDialog,b)));document.querySelectorAll('[data-online]').forEach(b=>b.addEventListener('click',()=>openModal(onlineDialog,b)));document.querySelector('[data-online-line]').addEventListener('click',e=>{const origin=opener;onlineDialog.close();openModal(lineDialog,origin)});
const today=new Date();form.elements.preferredDate.min=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
form.addEventListener('submit',ev=>{ev.preventDefault();const invalid=[...form.querySelectorAll('[required]')].filter(x=>!x.checkValidity());for(const x of form.querySelectorAll('[aria-invalid]'))x.removeAttribute('aria-invalid');if(invalid.length){invalid.forEach(x=>x.setAttribute('aria-invalid','true'));form.querySelector('.form-state').textContent='未入力または形式が異なる項目をご確認ください。';invalid[0].focus();return}form.querySelector('.form-state').textContent='';const fields={clinic:'ご希望院',name:'お名前',age:'ご年齢',phone:'電話番号',email:'メールアドレス',preferredDate:'ご希望日',preferredTime:'ご希望時間帯',plan:'ご興味のあるプラン',message:'ご質問・ご要望'};document.querySelector('#confirm-fields').innerHTML=Object.entries(fields).map(([k,v])=>`<div><dt>${v}</dt><dd>${safe(k==='clinic'?D.clinics.find(c=>c.id===form.elements[k].value)?.name:form.elements[k].value||'未指定')}</dd></div>`).join('');document.querySelector('#confirm-status').textContent='内容をご確認のうえ、送信してください。送信時点では予約は確定しません。';openModal(confirmDialog,form.querySelector('[type=submit]'))});
 
/* =========================================
   女性医療脱毛LP：予約希望のメール送信
   ========================================= */

const bookingSendButton = document.querySelector('[data-send-booking]');
let bookingSending = false;

bookingSendButton.addEventListener('click', async () => {
  if (bookingSending) return;

  const status = document.querySelector('#confirm-status');

  // 入力内容を再検証
  if (!form.checkValidity()) {
    status.textContent = '入力内容に不備があります。戻って確認してください。';
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  data.privacyConsent = form.elements.privacyConsent.checked ? 'on' : '';
  data.website = '';

  bookingSending = true;
  bookingSendButton.disabled = true;
  status.textContent = '送信しています。画面を閉じずにお待ちください。';

  try {
    // XserverのPHPから送信トークンを取得
    const tokenResponse = await fetch('send.php?mode=token', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store'
    });

    if (!tokenResponse.ok) {
      throw new Error('送信の準備ができませんでした。');
    }

    const tokenResult = await tokenResponse.json();

    if (!tokenResult.ok || !tokenResult.token) {
      throw new Error('送信の準備ができませんでした。');
    }

    data.csrf_token = tokenResult.token;

    // 予約希望をXserverへ送信
    const response = await fetch('send.php', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || '送信に失敗しました。');
    }

    status.textContent =
      '予約希望を受け付けました。担当スタッフからの連絡をお待ちください。';

    bookingSendButton.querySelector('b').textContent = '受付完了';
    form.reset();

  } catch (error) {
    status.textContent =
      error.message || '通信エラーが発生しました。';

    // 通信エラーでは受付成否が不明な場合があるため、
    // 自動で再送信しない

  } finally {
    bookingSending = false;
    bookingSendButton.disabled = false;
  }
});

function bindImageErrors(scope=document){scope.querySelectorAll('.photo-window img,.clinic-gallery img,.clinic-actual img').forEach(img=>{const fail=()=>{img.hidden=true;const p=img.parentElement;if(!p.querySelector('.image-missing'))p.insertAdjacentHTML('beforeend','<p class="image-missing">画像の読み込みを確認してください。<br>'+safe(img.alt)+'</p>')};img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail()})}bindImageErrors();
if(window.parent!==window)window.addEventListener('message',ev=>{if(ev.source!==window.parent)return;const ids=['top',...D.sourceOrder];if(ev.data?.type==='series-section'&&ids.includes(ev.data.id))document.getElementById(ev.data.id)?.scrollIntoView({behavior:'instant'})});

// Native horizontal review gallery: swipe, buttons, pagination and keyboard.
const reviewTrack=document.querySelector('.reviews-viewport');const reviewSlides=[...reviewTrack.querySelectorAll('.review-slide')];let reviewIndex=0;
function showReview(i){reviewIndex=Math.max(0,Math.min(reviewSlides.length-1,i));const x=reviewSlides[reviewIndex].offsetLeft-reviewSlides[0].offsetLeft;reviewTrack.scrollTo({left:x,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
document.querySelector('.slider-prev').addEventListener('click',()=>showReview(reviewIndex-1));document.querySelector('.slider-next').addEventListener('click',()=>showReview(reviewIndex+1));document.querySelectorAll('[data-review-index]').forEach(b=>b.addEventListener('click',()=>showReview(Number(b.dataset.reviewIndex))));
reviewTrack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showReview(reviewIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();showReview(reviewIndex-1)}});
reviewTrack.addEventListener('scroll',()=>{let closest=0,distance=Infinity;reviewSlides.forEach((s,i)=>{const d=Math.abs((s.offsetLeft-reviewSlides[0].offsetLeft)-reviewTrack.scrollLeft);if(d<distance){distance=d;closest=i}});reviewIndex=closest;document.querySelectorAll('[data-review-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===closest)));document.querySelector('.review-current').textContent=(closest+1)+' / '+reviewSlides.length;},{passive:true});
