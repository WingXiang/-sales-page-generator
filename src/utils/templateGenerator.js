function getOptimalGridClass(count) {
    if (count <= 1) return 'grid-cols-1';
    if (count % 2 === 0 && count % 3 !== 0) {
        return 'grid-cols-1 md:grid-cols-2';
    }
    return 'grid-cols-1 md:grid-cols-3';
}

export function generateInnerHTMLContent(state, deviceMode, forPreview = false) {
    let html = '';

    const cta1Index = state.layout ? state.layout.indexOf('cta1') : -1;
    const heroIndex = state.layout ? state.layout.indexOf('hero') : -1;
    const isCta1AfterHero = heroIndex !== -1 && cta1Index === heroIndex + 1;

    const renderCTASection = (id, cta, isNested = false) => {
        if (!cta || !cta.text || !cta.text.trim()) return '';
        const fontSize = cta.fontSize || '16px';
        const bgColor = cta.bgColor || '#c67e13';
        const paddingX = cta.paddingX || '32px';
        const paddingY = cta.paddingY || '16px';
        const borderRadius = cta.borderRadius || '16px';
        const widthMode = cta.widthMode || 'auto';
        const customWidth = cta.customWidth || '300px';
        const heightMode = cta.heightMode || 'auto';
        const customHeight = cta.customHeight || '50px';
        const link = cta.link || '#';
        const text = cta.text;
        
        const alignClass = id === 'cta1' ? 'justify-start' : 'justify-center';
        const containerPadding = isNested ? 'pt-2' : (id === 'cta1' ? 'pt-6 pb-6' : 'pt-8 pb-8');
        
        // Build style rules
        let btnStyle = `background-color: ${bgColor}; color: #ffffff; font-size: ${fontSize}; border: 1px solid ${bgColor}; border-radius: ${borderRadius};`;
        
        if (widthMode === 'full') {
            btnStyle += ` width: 100%; display: inline-flex; justify-content: center; align-items: center;`;
        } else if (widthMode === 'custom') {
            btnStyle += ` width: ${customWidth}; max-width: 100%; display: inline-flex; justify-content: center; align-items: center;`;
        } else {
            btnStyle += ` padding-left: ${paddingX}; padding-right: ${paddingX};`;
        }

        if (heightMode === 'custom') {
            btnStyle += ` height: ${customHeight}; display: inline-flex; justify-content: center; align-items: center;`;
        } else {
            btnStyle += ` padding-top: ${paddingY}; padding-bottom: ${paddingY};`;
            if (widthMode === 'full' || widthMode === 'custom') {
                btnStyle += ` display: inline-flex; justify-content: center; align-items: center;`;
            }
        }
        
        return `
            <!-- 行動呼籲按鈕 ${id} -->
            <section id="section-${id}" class="z-10 relative flex ${alignClass} ${containerPadding} animate-fade-in transition-all duration-300">
                <a href="${link}" data-live-path="${id}.text" class="cta-btn-custom font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-center" style="${btnStyle}">
                    ${text}
                </a>
            </section>
        `;
    };

    // 網站名稱（左上角顯示）— 金流審核要求平台需顯示網站名稱
    const siteName = state.brandInfo?.brandName || '';
    if (siteName) {
        html += `
            <!-- 網站名稱 / 平台名稱（左上角） -->
            <header id="site-header" class="flex items-center justify-start pb-2">
                <span data-live-path="brandInfo.brandName" class="text-lg md:text-xl font-black text-primary tracking-tight">${siteName}</span>
            </header>
        `;
    }

    state.layout.forEach(section => {
        switch (section) {
            case 'hero':
                // Handle both actual newlines and literal \n string
                const heroTitle = (state.hero?.title || '').replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
                const bulletsHtml = state.hero?.bullets ? state.hero.bullets.map((b, idx) => `
                    <li class="flex items-center justify-start gap-2.5 text-base md:text-lg animate-fade-in">
                        <span class="text-primary mt-0.5 shrink-0"><i class="fa-solid fa-circle-check"></i></span>
                        <span data-live-path="hero.bullets.${idx}.text" class="font-medium">${b.text || ''}</span>
                    </li>
                `).join('') : '';
                
                const heroCtaHtml = isCta1AfterHero ? renderCTASection('cta1', state.cta1, true) : '';
                
                html += `
                    <!-- 首屏主視覺區 -->
                    <section id="section-hero" class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 transition-all duration-300 pt-8 pb-16">
                        <div class="lg:col-span-7 space-y-6 text-left">
                             <h1 data-live-path="hero.title" class="hero-title font-black tracking-tight leading-tight text-primary" style="font-size: 40px; line-height: 1.2;">
                                 ${heroTitle}
                             </h1>
                             <ul class="space-y-3.5 opacity-80 inline-block text-left w-full">
                                 ${bulletsHtml}
                             </ul>
                             ${heroCtaHtml}
                        </div>
                        <div class="lg:col-span-5 relative flex justify-center">
                            <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[2.5rem] blur-2xl"></div>
                            <img class="w-full max-w-md lg:max-w-none h-auto object-cover rounded-[2rem] border border-slate-200 shadow-2xl relative z-10" src="${state.hero?.image || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="Hero Image" onerror="this.src='https://placehold.co/600x500/eae8fc/4f46e5?text=Brand+Image'">
                        </div>
                    </section>
                `;
                break;

            case 'painPoints':
                const painGridClass = getOptimalGridClass(state.painPoints ? state.painPoints.length : 0);
                const painList = state.painPoints ? state.painPoints.map((p, idx) => `
                    <div class="premium-card p-8 relative overflow-hidden group hover:shadow-xl transition-all border border-slate-100 rounded-3xl bg-white">
                        <div class="absolute -right-4 -bottom-4 text-8xl font-black text-slate-50 opacity-50 select-none group-hover:scale-110 transition-transform">0${idx+1}</div>
                        <div class="relative z-10 space-y-4">
                            <h3 data-live-path="painPoints.${idx}.title" class="pain-title font-extrabold tracking-tight text-primary text-xl">
                                ${p.title || ''}
                            </h3>
                            <p data-live-path="painPoints.${idx}.desc" class="text-sm md:text-base opacity-70 leading-relaxed">${p.desc || ''}</p>
                        </div>
                    </div>
                `).join('') : '';

                html += `
                    <!-- 痛點共鳴區 -->
                    <section id="section-painPoints" class="space-y-12 animate-fade-in transition-all duration-300 pt-10">
                        <div class="text-center max-w-2xl mx-auto">
                            <h2 class="text-3xl md:text-4xl font-black tracking-tight text-primary" data-live-path="meta.painTitleMain">${state.meta?.painTitleMain || '您是否也正面臨這些成長瓶頸？'}</h2>
                        </div>
                        <div class="grid ${painGridClass} gap-6 max-w-6xl mx-auto">
                            ${painList}
                        </div>
                    </section>
                `;
                break;

            case 'empathy':
                const empathyQuote = (state.empathy?.quote || '').replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
                const empathyText = (state.empathy?.text || '').replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
                
                html += `
                    <!-- 感同身受區 -->
                    <section id="section-empathy" class="premium-card p-8 md:p-16 bg-white border border-slate-200 rounded-3xl shadow-sm text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden animate-fade-in transition-all duration-300">
                        <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
                        <div class="relative z-10 space-y-6">
                            <blockquote data-live-path="empathy.quote" class="empathy-quote font-black leading-normal italic text-primary">
                                ${empathyQuote}
                            </blockquote>
                            <p data-live-path="empathy.text" class="text-base md:text-lg opacity-80 leading-relaxed max-w-2xl mx-auto">
                                ${empathyText}
                            </p>
                        </div>
                    </section>
                `;
                break;

            case 'transition':
                const transCards = state.transition?.cards ? state.transition.cards.map((c, idx) => `
                    <div class="p-8 rounded-2xl border ${idx === 0 ? 'border-slate-200 bg-white/50 opacity-80' : 'border-primary/30 bg-indigo-50/50 shadow-md'} relative animate-fade-in">
                        <div class="absolute top-4 right-4 ${idx === 0 ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'} rounded-full px-3 py-1 text-[10px] font-bold">
                            ${idx === 0 ? '💔 傳統現狀' : '✨ 高效未來'}
                        </div>
                        <h4 data-live-path="transition.cards.${idx}.title" class="font-extrabold text-lg md:text-xl text-primary mb-3">${c.title || ''}</h4>
                        <p data-live-path="transition.cards.${idx}.desc" class="text-sm leading-relaxed">${c.desc || ''}</p>
                    </div>
                `).join('') : '';

                html += `
                    <!-- 觀念翻轉區 -->
                    <section id="section-transition" class="space-y-12 animate-fade-in transition-all duration-300">
                        <div class="text-center max-w-2xl mx-auto">
                            <p data-live-path="transition.title" class="text-2xl md:text-3xl font-black tracking-tight text-primary">${state.transition?.title || '舊觀念觀點翻轉'}</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            ${transCards}
                        </div>
                    </section>
                `;
                break;

            case 'promise':
                const promiseList = state.promise?.items ? state.promise.items.map((item, idx) => `
                    <div class="flex items-start gap-4 animate-fade-in">
                        <i class="fa-solid fa-circle-check text-accent mt-1.5 shrink-0 text-xl"></i>
                        <div>
                            <p data-live-path="promise.items.${idx}.text" class="font-bold text-lg">${item.text || ''}</p>
                        </div>
                    </div>
                `).join('') : '';

                html += `
                    <!-- 核心承諾區 -->
                    <section id="section-promise" class="premium-card bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto animate-fade-in transition-all duration-300">
                        <div class="lg:col-span-4 text-center lg:text-left space-y-2">
                            <h3 data-live-path="promise.title" class="text-xl md:text-2xl font-black tracking-tight text-primary">${state.promise?.title || '我們的承諾與轉變'}</h3>
                        </div>
                        <div class="lg:col-span-8 space-y-4">
                            ${promiseList}
                        </div>
                    </section>
                `;
                break;

            case 'services':
                const serviceGridClass = getOptimalGridClass(state.services?.items ? state.services.items.length : 0);
                const serviceList = state.services?.items ? state.services.items.map((s, idx) => `
                    <div class="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-lg transition-all space-y-4 animate-fade-in">
                        <h3 data-live-path="services.items.${idx}.name" class="service-title font-extrabold tracking-tight text-primary text-lg">
                            ${s.name || ''}
                        </h3>
                        <p data-live-path="services.items.${idx}.desc" class="text-sm md:text-base opacity-70 leading-relaxed">${s.desc || ''}</p>
                    </div>
                `).join('') : '';

                html += `
                    <!-- 產品優勢/規格區 -->
                    <section id="section-services" class="space-y-12 animate-fade-in transition-all duration-300">
                        <div class="text-center max-w-2xl mx-auto">
                            <p data-live-path="services.title" class="text-2xl md:text-3xl font-black tracking-tight text-primary">${state.services?.title || '獨一無二的超值資源'}</p>
                        </div>
                        <div class="grid ${serviceGridClass} gap-8 max-w-6xl mx-auto">
                            ${serviceList}
                        </div>
                    </section>
                `;
                break;

            case 'curriculum':
                const currList = state.curriculum ? state.curriculum.map((c, idx) => {
                    const contentHtml = (c.content || '').replace(/\n/g, '<br>');
                    return `
                        <div class="flex gap-4 md:gap-6 relative animate-fade-in">
                            <div class="flex flex-col items-center">
                                <div class="w-10 h-10 bg-indigo-50 border border-primary/20 text-primary text-xs font-black rounded-full flex items-center justify-center relative z-10 shrink-0">
                                    L${idx+1}
                                </div>
                                <div class="w-0.5 bg-slate-200 grow my-1"></div>
                            </div>
                            <div class="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm grow space-y-2 mb-6">
                                <h4 data-live-path="curriculum.${idx}.title" class="font-bold text-base md:text-lg text-primary">${c.title || ''}</h4>
                                <p data-live-path="curriculum.${idx}.content" class="text-sm opacity-70 leading-relaxed">${contentHtml}</p>
                            </div>
                        </div>
                    `;
                }).join('') : '';

                html += `
                    <!-- 教學/工作單元大綱 -->
                    <section id="section-curriculum" class="space-y-12 max-w-3xl mx-auto animate-fade-in transition-all duration-300">
                        <div class="text-center">
                            <p class="text-2xl md:text-3xl font-black tracking-tight text-primary" data-live-path="meta.currTitleMain">${state.meta?.currTitleMain || '系統化的實戰單元大綱'}</p>
                        </div>
                        <div class="space-y-0 relative pt-4">
                            ${currList}
                        </div>
                    </section>
                `;
                break;

            case 'courseInfo': {
                const ci = state.courseInfo || {};
                const ciRows = [
                    ['課程名稱', 'courseInfo.courseName', ci.courseName],
                    ['課程堂數', 'courseInfo.lessonCount', ci.lessonCount],
                    ['課堂總時數', 'courseInfo.totalHours', ci.totalHours],
                    ['觀看期限（履約期間）', 'courseInfo.accessPeriod', ci.accessPeriod],
                    ['收看方式／軟體', 'courseInfo.platform', ci.platform],
                ].filter(r => r[2] && String(r[2]).trim());

                const ciRowsHtml = ciRows.map(([label, path, val]) => `
                    <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-3.5 border-b border-slate-100 last:border-0">
                        <dt class="text-sm font-black text-primary sm:w-44 shrink-0">${label}</dt>
                        <dd data-live-path="${path}" class="text-sm md:text-base opacity-80 leading-relaxed">${val}</dd>
                    </div>
                `).join('');

                html += `
                    <!-- 課程資訊（金流審核：時數/堂數/履約期間/收看方式） -->
                    <section id="section-courseInfo" class="space-y-8 max-w-3xl mx-auto animate-fade-in transition-all duration-300">
                        <div class="text-center">
                            <p class="text-2xl md:text-3xl font-black tracking-tight text-primary" data-live-path="courseInfo.title">${ci.title || '課程資訊'}</p>
                        </div>
                        <dl class="bg-white border border-slate-200 rounded-3xl shadow-sm px-6 md:px-10 py-2">
                            ${ciRowsHtml}
                        </dl>
                    </section>
                `;
                break;
            }

            case 'about':
                const aboutText = (state.brandInfo?.aboutText || '').replace(/\n/g, '<br>');
                html += `
                    <!-- 關於我們品牌故事 -->
                    <section id="section-about" class="premium-card p-8 md:p-12 relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm animate-fade-in transition-all duration-300 max-w-4xl mx-auto">
                        <div class="grid grid-cols-1 gap-8 items-center">
                            <div class="space-y-4 text-center md:text-left">
                                <h3 data-live-path="brandInfo.brandName" class="text-xl md:text-2xl font-black text-primary">${state.brandInfo?.brandName || ''}</h3>
                                <p data-live-path="brandInfo.aboutText" class="text-sm md:text-base opacity-80 leading-relaxed">${aboutText}</p>
                                <div class="pt-2 text-xs opacity-75 space-y-1 font-bold">
                                    ${state.brandInfo?.contactEmail ? `<p>信箱：<span data-live-path="brandInfo.contactEmail">${state.brandInfo.contactEmail}</span></p>` : ''}
                                    ${state.brandInfo?.contactLine ? `<p>LINE：<span data-live-path="brandInfo.contactLine">${state.brandInfo.contactLine}</span></p>` : ''}
                                </div>
                            </div>
                        </div>
                    </section>
                `;
                break;

            case 'authority':
                const statsHtml = (state.authority?.stats && state.authority.stats.length > 0) ? state.authority.stats.map((s, idx) => `
                    <div class="text-center animate-fade-in">
                        <div data-live-path="authority.stats.${idx}.value" class="text-2xl md:text-3xl font-black text-primary">${s.value || ''}</div>
                        <div data-live-path="authority.stats.${idx}.label" class="text-xs opacity-60 font-bold">${s.label || ''}</div>
                    </div>
                `).join('') : '';

                const statsGridClass = getOptimalGridClass(state.authority?.stats?.length || 0);
                const statsContainer = statsHtml ? `
                    <div class="grid ${statsGridClass} gap-4 border-t border-slate-100 pt-5">
                        ${statsHtml}
                    </div>
                ` : '';

                const bioClass = statsHtml ? 'text-sm md:text-base opacity-80 leading-relaxed' : 'text-base md:text-lg opacity-85 leading-loose';

                html += `
                    <!-- 專家權威 -->
                    <section id="section-authority" class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center max-w-4xl mx-auto animate-fade-in transition-all duration-300">
                        <div class="md:col-span-4 flex justify-center">
                            <img class="w-48 h-48 rounded-2xl object-cover shadow-lg border-2 border-white" src="${state.authority?.image || 'https://i.ibb.co/NgG55zqk/portrait-1771585005753.png'}" alt="Expert Image" onerror="this.src='https://i.ibb.co/NgG55zqk/portrait-1771585005753.png'">
                        </div>
                        <div class="md:col-span-8 space-y-5">
                            <div class="space-y-1">
                                <h3 data-live-path="authority.name" class="text-xl md:text-2xl font-black text-primary">${state.authority?.name || '專業導師'}</h3>
                            </div>
                            <p data-live-path="authority.bio" class="${bioClass}">${state.authority?.bio || ''}</p>
                            ${statsContainer}
                        </div>
                    </section>
                `;
                break;

            case 'qualification':
                const fitHtml = state.qualification?.fit ? state.qualification.fit.map((item, idx) => `
                    <li class="flex items-start gap-2.5 text-sm md:text-base animate-fade-in">
                        <i class="fa-solid fa-circle-check text-green-500 mt-1 shrink-0"></i>
                        <span data-live-path="qualification.fit.${idx}.text">${item.text || ''}</span>
                    </li>
                `).join('') : '';

                const unfitHtml = state.qualification?.unfit ? state.qualification.unfit.map((item, idx) => `
                    <li class="flex items-start gap-2.5 text-sm md:text-base animate-fade-in">
                        <i class="fa-solid fa-circle-xmark text-red-500 mt-1 shrink-0"></i>
                        <span data-live-path="qualification.unfit.${idx}.text" class="opacity-70">${item.text || ''}</span>
                    </li>
                `).join('') : '';

                html += `
                    <!-- 適合/不適合客群篩選 -->
                    <section id="section-qualification" class="space-y-12 max-w-4xl mx-auto animate-fade-in transition-all duration-300">
                        <div class="text-center max-w-xl mx-auto">
                            <p class="text-2xl md:text-3xl font-black tracking-tight text-primary" data-live-path="meta.qualTitleMain">${state.meta?.qualTitleMain || '本服務或課程是否真的符合您？'}</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="p-6 md:p-8 bg-green-50/50 border border-green-200/50 rounded-[2rem] space-y-5">
                                <h3 class="text-lg font-black text-green-800 flex items-center gap-2"><i class="fa-solid fa-circle-check"></i> 我們推薦您加入，如果您：</h3>
                                <ul class="space-y-3 text-green-950">${fitHtml}</ul>
                            </div>
                            <div class="p-6 md:p-8 bg-slate-50 border border-slate-200/50 rounded-[2rem] space-y-5">
                                <h3 class="text-lg font-black opacity-80 flex items-center gap-2 text-primary"><i class="fa-solid fa-circle-xmark text-red-500"></i> 可能不適合您，如果您：</h3>
                                <ul class="space-y-3 opacity-80">${unfitHtml}</ul>
                            </div>
                        </div>
                    </section>
                `;
                break;

            case 'testimonials':
                const testGridClass = getOptimalGridClass(state.testimonials ? state.testimonials.length : 0);
                const testList = state.testimonials ? state.testimonials.map((t, idx) => `
                    <div class="p-6 md:p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 animate-fade-in">
                        <div class="flex items-center gap-1.5 text-yellow-400 font-black text-lg">
                            ★★★★★
                        </div>
                        <p data-live-path="testimonials.${idx}.content" class="text-sm md:text-base opacity-85 italic">"${t.content || ''}"</p>
                        <div class="border-t border-slate-100 pt-3.5 flex justify-between items-center text-xs opacity-60 font-bold">
                            <span data-live-path="testimonials.${idx}.name">${t.name || ''}</span>
                            <span data-live-path="testimonials.${idx}.role">${t.role || ''}</span>
                        </div>
                    </div>
                `).join('') : '';

                html += `
                    <!-- 學員真實見證 -->
                    <section id="section-testimonials" class="space-y-12 animate-fade-in transition-all duration-300">
                        <div class="text-center max-w-2xl mx-auto">
                            <p class="text-2xl md:text-3xl font-black tracking-tight text-primary" data-live-path="meta.testTitleMain">${state.meta?.testTitleMain || '來自第一線使用者的好評回饋'}</p>
                        </div>
                        <div class="grid ${testGridClass} gap-8">
                            ${testList}
                        </div>
                    </section>
                `;
                break;

            case 'pricingPlans':
                const priceGridClass = getOptimalGridClass(state.pricingPlans ? state.pricingPlans.length : 0);
                const priceCards = state.pricingPlans ? state.pricingPlans.map((p, idx) => {
                    const featuresList = p.features ? p.features.split('\n').map(f => `
                        <li class="flex items-center gap-2.5 text-sm opacity-80">
                            <i class="fa-solid fa-check text-primary mt-1 shrink-0"></i>
                            <span>${f}</span>
                        </li>
                    `).join('') : '';

                    return `
                        <div class="p-6 md:p-10 bg-white border-2 border-primary rounded-3xl shadow-xl space-y-6 relative overflow-hidden w-full max-w-sm animate-fade-in">
                            <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
                            <div class="space-y-2">
                                ${p.urgency ? `<span data-live-path="pricingPlans.${idx}.urgency" class="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100">${p.urgency}</span>` : ''}
                                <h3 data-live-path="pricingPlans.${idx}.title" class="font-black text-xl md:text-2xl text-primary">${p.title || ''}</h3>
                            </div>
                            <div class="flex items-baseline gap-2 flex-wrap">
                                <span class="text-3xl md:text-4xl font-black">NT$ <span data-live-path="pricingPlans.${idx}.currentPrice">${p.currentPrice || '0'}</span></span>
                                ${p.originalPrice ? `<span class="text-sm opacity-60 line-through">原價 NT$ <span data-live-path="pricingPlans.${idx}.originalPrice">${p.originalPrice}</span></span>` : ''}
                            </div>
                            <div class="border-t border-slate-100 pt-5">
                                <ul class="space-y-3">
                                    ${featuresList}
                                </ul>
                            </div>
                            <div class="pt-4 space-y-3">
                                <a href="${p.ctaLink || '#'}" data-live-path="pricingPlans.${idx}.ctaText" class="w-full py-4 bg-primary hover:bg-opacity-90 text-white font-black text-center rounded-2xl block shadow-md transition-all text-sm uppercase tracking-wider">${p.ctaText || '立即申請'}</a>
                                ${p.guarantee ? `<p data-live-path="pricingPlans.${idx}.guarantee" class="text-[10px] opacity-60 text-center font-bold">${p.guarantee}</p>` : ''}
                            </div>
                        </div>
                    `;
                }).join('') : '';

                html += `
                    <!-- 定價方案與轉化區 -->
                    <section id="section-pricingPlans" class="space-y-12 animate-fade-in transition-all duration-300">
                        <div class="text-center max-w-2xl mx-auto">
                            <p class="text-2xl md:text-3xl font-black tracking-tight text-primary" data-live-path="meta.priceTitleMain">${state.meta?.priceTitleMain || '限時超值回饋方案'}</p>
                        </div>
                        <div class="grid ${priceGridClass} gap-8 max-w-5xl mx-auto justify-items-center">
                            ${priceCards}
                        </div>
                    </section>
                `;
                break;

            case 'faq':
                const faqList = state.faq ? state.faq.map((f, idx) => `
                    <details class="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2 group animate-fade-in" ${idx === 0 ? 'open' : ''}>
                        <summary class="font-bold text-primary text-base flex items-center justify-between cursor-pointer list-none select-none outline-none">
                            <span class="flex items-start gap-2 text-left pr-4">
                                <span class="text-primary font-black">Q.</span>
                                <span data-live-path="faq.${idx}.q">${f.q || ''}</span>
                            </span>
                            <span class="transition-transform duration-300 group-open:rotate-180 text-primary shrink-0 font-bold">
                                ＋
                            </span>
                        </summary>
                        <p data-live-path="faq.${idx}.a" class="text-sm opacity-75 leading-relaxed pl-5 pt-4 border-t border-slate-100 mt-4">${f.a || ''}</p>
                    </details>
                `).join('') : '';

                html += `
                    <!-- 常見問答消除疑慮 -->
                    <section id="section-faq" class="space-y-12 max-w-3xl mx-auto animate-fade-in transition-all duration-300">
                        <div class="text-center">
                            <p class="text-2xl md:text-3xl font-black tracking-tight text-primary" data-live-path="meta.faqTitleMain">${state.meta?.faqTitleMain || '為您排除所有學習疑慮'}</p>
                        </div>
                        <div class="space-y-4">
                            ${faqList}
                        </div>
                    </section>
                `;
                break;

            case 'close':
                const closeText = (state.close?.text || '').replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
                html += `
                    <!-- 感性促單結尾 -->
                    <section id="section-close" class="text-center max-w-3xl mx-auto space-y-8 relative z-10 py-10 animate-fade-in transition-all duration-300">
                        <h2 data-live-path="close.text" class="close-title font-black italic text-primary" style="font-size: 32px; line-height: 1.3;">
                            ${closeText}
                        </h2>
                    </section>
                `;
                break;

            case 'cta1':
                if (!isCta1AfterHero) {
                    html += renderCTASection('cta1', state.cta1);
                }
                break;

            case 'cta2':
                html += renderCTASection('cta2', state.cta2);
                break;

            case 'cta3':
                html += renderCTASection('cta3', state.cta3);
                break;

            case 'complianceFooter': {
                const c = state.compliance || {};
                const m = c.merchant || {};

                // 把政策內文的 {{變數}} 以商家欄位自動帶入
                const sub = (t) => (t || '')
                    .replace(/\{\{品牌名\}\}/g, m.brandName || state.brandInfo?.brandName || '')
                    .replace(/\{\{公司名\}\}/g, m.companyName || '')
                    .replace(/\{\{統一編號\}\}/g, m.taxId || '')
                    .replace(/\{\{客服信箱\}\}/g, m.email || '')
                    .replace(/\{\{Line\}\}/g, m.lineId || '')
                    .replace(/\{\{管轄地\}\}/g, m.jurisdiction || '');
                const nl2br = (t) => sub(t).replace(/\\n/g, '\n').replace(/\n/g, '<br>');

                // 要做成「另開分頁」的政策文件（依使用者選擇的順序與內容過濾）
                const docs = [
                    { id: 'doc-terms', title: '使用者條款', path: 'compliance.terms', text: c.terms },
                    { id: 'doc-privacy', title: '隱私權政策', path: 'compliance.privacyPolicy', text: c.privacyPolicy },
                    { id: 'doc-refund', title: '退費/退貨政策', path: 'compliance.refundPolicy', text: c.refundPolicy },
                    { id: 'doc-disclaimer', title: '免責聲明', path: 'compliance.disclaimer', text: c.disclaimer },
                ].filter(d => d.text && d.text.trim());

                const contactRow = (label, value) => value ? `<p class="opacity-80"><span class="opacity-60">${label}：</span>${value}</p>` : '';

                const linkTarget = forPreview ? '' : ' target="_blank" rel="noopener"';
                const footerLinks = docs.map(d => `
                    <a href="#${d.id}"${linkTarget} class="legal-link block opacity-80 hover:opacity-100 hover:text-primary transition-colors w-fit">${d.title}</a>
                `).join('');

                // 版權聲明直接由商家欄位即時組出（不依賴可能過期的 c.copyright）
                const _brand = m.brandName || state.brandInfo?.brandName || '';
                const _company = m.companyName || '';
                const _tax = m.taxId || '';
                const copyrightLine = (_brand || _company || _tax)
                    ? `COPYRIGHT© ${_brand} All rights reserved ${_company}．統一編號: ${_tax}`
                    : '';

                const overlays = docs.map(d => `
                    <section id="${d.id}" class="legal-doc" style="display:none;">
                        <div class="max-w-3xl mx-auto px-6 py-12 md:py-16">
                            <div class="flex items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-primary">
                                <h1 class="text-xl md:text-2xl font-black text-primary">${d.title}</h1>
                                ${forPreview ? `<a href="#" onclick="event.preventDefault(); location.hash='';" class="legal-back text-xs md:text-sm font-bold text-primary border border-primary/30 rounded-full px-4 py-1.5 hover:bg-primary hover:text-white transition-colors shrink-0">← 返回銷售頁</a>` : ''}
                            </div>
                            <div class="text-sm leading-loose opacity-80 whitespace-pre-line">${nl2br(d.text)}</div>
                            ${copyrightLine ? `<p class="mt-12 pt-6 border-t border-slate-200/60 text-[11px] opacity-50">${copyrightLine}</p>` : ''}
                        </div>
                    </section>
                `).join('');

                html += `
                    <!-- 金流申請用頁尾：聯絡資訊、政策連結與版權 -->
                    <footer id="section-complianceFooter" class="border-t-4 border-primary pt-12 mt-8 text-slate-600 animate-fade-in transition-all duration-300">
                        <div class="max-w-4xl mx-auto space-y-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm">
                                <div class="space-y-2.5">
                                    <h3 class="text-base font-black text-primary flex items-center gap-2 mb-3">
                                        <span class="inline-block w-1.5 h-5 bg-accent rounded-full"></span>聯絡我們
                                    </h3>
                                    ${contactRow('客服信箱', m.email ? `<span data-live-path="compliance.merchant.email">${m.email}</span>` : '')}
                                    ${contactRow('客服電話', m.phone ? `<span data-live-path="compliance.merchant.phone">${m.phone}</span>` : '')}
                                    ${contactRow('客服時間', m.serviceHours ? `<span data-live-path="compliance.merchant.serviceHours">${m.serviceHours}</span>` : '')}
                                </div>
                                <div class="space-y-2.5">
                                    <h3 class="text-base font-black text-primary flex items-center gap-2 mb-3">
                                        <span class="inline-block w-1.5 h-5 bg-accent rounded-full"></span>服務條款與政策
                                    </h3>
                                    ${footerLinks}
                                </div>
                            </div>
                            ${copyrightLine ? `<p class="text-[11px] md:text-xs opacity-50 pt-6 border-t border-slate-200/60">${copyrightLine}</p>` : ''}
                        </div>
                    </footer>

                    <!-- 政策全頁（預設隱藏，點頁尾連結於新分頁以 #hash 開啟） -->
                    ${overlays}
                    <style>
                        .legal-doc {
                            position: fixed;
                            inset: 0;
                            z-index: 9999;
                            overflow-y: auto;
                            background-color: var(--bg-color, #f8fafc);
                            color: var(--text-color, #0f172a);
                        }
                    </style>
                    <script>
                        (function () {
                            function renderLegalDoc() {
                                var hash = (location.hash || '').replace('#', '');
                                var docs = document.querySelectorAll('.legal-doc');
                                var shown = false;
                                docs.forEach(function (d) {
                                    var s = d.id === hash;
                                    d.style.display = s ? 'block' : 'none';
                                    if (s) shown = true;
                                });
                                if (document.body) document.body.style.overflow = shown ? 'hidden' : '';
                                if (shown) window.scrollTo(0, 0);
                            }
                            window.addEventListener('hashchange', renderLegalDoc);
                            if (document.readyState !== 'loading') renderLegalDoc();
                            else window.addEventListener('DOMContentLoaded', renderLegalDoc);
                        })();
                    </script>
                `;
                break;
            }
        }
    });

    html += `
        <style>
            .focused-element {
                outline: 2px dashed #fbbf24 !important;
                outline-offset: 4px;
                background-color: rgba(251, 191, 36, 0.1) !important;
                border-radius: 4px;
                transition: all 0.2s ease-in-out;
            }
        </style>
        <script>
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SCROLL_TO') {
                    const el = document.getElementById(event.data.sectionId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
                
                if (event.data && event.data.type === 'FOCUS_ELEMENT') {
                    document.querySelectorAll('.focused-element').forEach(el => el.classList.remove('focused-element'));
                    if (event.data.path) {
                        const el = document.querySelector(\`[data-live-path="\${event.data.path}"]\`);
                        if (el) {
                            el.classList.add('focused-element');
                            // Ensure it's in view
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }
            });
        </script>
    `;

    // Dynamic Element Styles based on device
    if (state.elementStyles) {
        let css = '<style id="dynamic-element-styles">\n';
        
        // Desktop
        if (state.elementStyles.desktop) {
            // Apply immediately in preview when device-desktop mode is active
            for (const [path, styles] of Object.entries(state.elementStyles.desktop)) {
                css += `  .device-desktop [data-live-path="${path}"] {\n`;
                if (styles.fontSize) css += `    font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) css += `    color: ${styles.color} !important;\n`;
                if (styles.textAlign) css += `    text-align: ${styles.textAlign} !important;\n`;
                css += `  }\n`;
            }
            // Standard media query for exported production HTML
            css += '@media (min-width: 1024px) {\n';
            for (const [path, styles] of Object.entries(state.elementStyles.desktop)) {
                css += `  [data-live-path="${path}"] {\n`;
                if (styles.fontSize) css += `    font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) css += `    color: ${styles.color} !important;\n`;
                if (styles.textAlign) css += `    text-align: ${styles.textAlign} !important;\n`;
                css += `  }\n`;
            }
            css += '}\n';
        }

        // Tablet
        if (state.elementStyles.tablet) {
            // Apply immediately in preview when device-tablet mode is active
            for (const [path, styles] of Object.entries(state.elementStyles.tablet)) {
                css += `  .device-tablet [data-live-path="${path}"] {\n`;
                if (styles.fontSize) css += `    font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) css += `    color: ${styles.color} !important;\n`;
                if (styles.textAlign) css += `    text-align: ${styles.textAlign} !important;\n`;
                css += `  }\n`;
            }
            // Standard media query for exported production HTML
            css += '@media (min-width: 768px) and (max-width: 1023px) {\n';
            for (const [path, styles] of Object.entries(state.elementStyles.tablet)) {
                css += `  [data-live-path="${path}"] {\n`;
                if (styles.fontSize) css += `    font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) css += `    color: ${styles.color} !important;\n`;
                if (styles.textAlign) css += `    text-align: ${styles.textAlign} !important;\n`;
                css += `  }\n`;
            }
            css += '}\n';
        }

        // Mobile
        if (state.elementStyles.mobile) {
            // Apply immediately in preview when device-mobile mode is active
            for (const [path, styles] of Object.entries(state.elementStyles.mobile)) {
                css += `  .device-mobile [data-live-path="${path}"] {\n`;
                if (styles.fontSize) css += `    font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) css += `    color: ${styles.color} !important;\n`;
                if (styles.textAlign) css += `    text-align: ${styles.textAlign} !important;\n`;
                css += `  }\n`;
            }
            // Standard media query for exported production HTML
            css += '@media (max-width: 767px) {\n';
            for (const [path, styles] of Object.entries(state.elementStyles.mobile)) {
                css += `  [data-live-path="${path}"] {\n`;
                if (styles.fontSize) css += `    font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) css += `    color: ${styles.color} !important;\n`;
                if (styles.textAlign) css += `    text-align: ${styles.textAlign} !important;\n`;
                css += `  }\n`;
            }
            css += '}\n';
        }

        css += '</style>\n';
        html += css;
    }

    return html;
}
