import { generateInnerHTMLContent } from './templateGenerator';

export function exportHTML(state) {
    let customStyleRulesDesktop = '';
    let customStyleRulesTablet = '';
    let customStyleRulesMobile = '';

    // Legacy customStyles support
    if (state.customStyles) {
        Object.keys(state.customStyles).forEach(path => {
            const style = state.customStyles[path];
            const selector = `[data-live-path="${path}"]`;
            
            if (style.fontSize?.desktop) customStyleRulesDesktop += `\n        ${selector} { font-size: ${style.fontSize.desktop}px !important; }`;
            if (style.fontColor?.desktop) customStyleRulesDesktop += `\n        ${selector} { color: ${style.fontColor.desktop} !important; }`;

            if (style.fontSize?.tablet) customStyleRulesTablet += `\n        ${selector} { font-size: ${style.fontSize.tablet}px !important; }`;
            if (style.fontColor?.tablet) customStyleRulesTablet += `\n        ${selector} { color: ${style.fontColor.tablet} !important; }`;

            if (style.fontSize?.mobile) customStyleRulesMobile += `\n        ${selector} { font-size: ${style.fontSize.mobile}px !important; }`;
            if (style.fontColor?.mobile) customStyleRulesMobile += `\n        ${selector} { color: ${style.fontColor.mobile} !important; }`;
        });
    }

    // Dynamic Element Styles based on device
    if (state.elementStyles) {
        // Desktop
        if (state.elementStyles.desktop) {
            for (const [path, styles] of Object.entries(state.elementStyles.desktop)) {
                customStyleRulesDesktop += `\n        [data-live-path="${path}"] {\n`;
                if (styles.fontSize) customStyleRulesDesktop += `            font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) customStyleRulesDesktop += `            color: ${styles.color} !important;\n`;
                if (styles.textAlign) customStyleRulesDesktop += `            text-align: ${styles.textAlign} !important;\n`;
                customStyleRulesDesktop += `        }`;
            }
        }
        // Tablet
        if (state.elementStyles.tablet) {
            for (const [path, styles] of Object.entries(state.elementStyles.tablet)) {
                customStyleRulesTablet += `\n        [data-live-path="${path}"] {\n`;
                if (styles.fontSize) customStyleRulesTablet += `            font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) customStyleRulesTablet += `            color: ${styles.color} !important;\n`;
                if (styles.textAlign) customStyleRulesTablet += `            text-align: ${styles.textAlign} !important;\n`;
                customStyleRulesTablet += `        }`;
            }
        }
        // Mobile
        if (state.elementStyles.mobile) {
            for (const [path, styles] of Object.entries(state.elementStyles.mobile)) {
                customStyleRulesMobile += `\n        [data-live-path="${path}"] {\n`;
                if (styles.fontSize) customStyleRulesMobile += `            font-size: ${styles.fontSize} !important;\n`;
                if (styles.color) customStyleRulesMobile += `            color: ${styles.color} !important;\n`;
                if (styles.textAlign) customStyleRulesMobile += `            text-align: ${styles.textAlign} !important;\n`;
                customStyleRulesMobile += `        }`;
            }
        }
    }

    const htmlString = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.brandInfo?.brandName || '精選'} - 官方銷售網頁</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: 'var(--primary-color)',
                        accent: 'var(--accent-color)'
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-color: ${state.theme?.bgColor || '#f8fafc'};
            --text-color: ${state.theme?.textColor || '#0f172a'};
            --primary-color: ${state.theme?.primaryColor || '#2a4189'};
            --accent-color: ${state.theme?.accentColor || '#fbbf24'};
        }
        body, html { 
            background-color: var(--bg-color); 
            color: var(--text-color); 
            font-family: "Inter", "Microsoft JhengHei", "Segoe UI", sans-serif !important; 
            word-break: break-word; 
            overflow-x: hidden;
        }
        .text-primary { color: var(--primary-color) !important; }
        .bg-primary { background-color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
        .text-accent { color: var(--accent-color) !important; }
        .bg-accent { background-color: var(--accent-color) !important; }
        .border-accent { border-color: var(--accent-color) !important; }
        .premium-card {
            background: rgba(128, 128, 128, 0.03); 
            border: 1px solid rgba(128, 128, 128, 0.12); 
            border-radius: 1.5rem;
            box-shadow: 0 4px 20px 0 rgba(0,0,0,0.02);
        }
        .text-primary-btn {
            background: linear-gradient(135deg, var(--accent-color), #f97316) !important;
        }
        
        .hero-title { font-size: 48px; font-weight: 900; }
        .close-title { font-size: 36px; font-weight: 900; }
        .empathy-quote { font-size: 32px; font-weight: 900; }
        .pain-title { font-size: 24px; font-weight: 800; }
        .service-title { font-size: 24px; font-weight: 800; }

        a:hover, button:hover, [role="button"]:hover {
            background-color: #0f172a !important;
            color: #ffffff !important;
            background-image: none !important;
            border-color: #0f172a !important;
            box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.35) !important;
        }

        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }

        /* Desktop styles */
        @media (min-width: 1024px) {
            ${customStyleRulesDesktop}
        }

        /* Tablet styles */
        @media (min-width: 768px) and (max-width: 1023px) {
            .hero-title { font-size: 38px; }
            .close-title { font-size: 28px; }
            .empathy-quote { font-size: 26px; }
            .pain-title { font-size: 20px; }
            .service-title { font-size: 20px; }
            ${customStyleRulesTablet}
        }

        /* Mobile styles */
        @media (max-width: 767px) {
            .hero-title { font-size: 28px; }
            .close-title { font-size: 22px; }
            .empathy-quote { font-size: 20px; }
            .pain-title { font-size: 18px; }
            .service-title { font-size: 18px; }
            ${customStyleRulesMobile}
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        main > #section-cta1 {
            margin-top: -3.5rem !important;
        }
        #section-cta1 {
            margin-top: 1.5rem !important;
        }
        #section-cta2, 
        #section-cta3 {
            margin-top: -2rem !important;
        }
    </style>
</head>
<body class="antialiased min-h-screen">
    <main class="w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 space-y-32">
        ${generateInnerHTMLContent(state)}
    </main>
</body>
</html>`;

    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(state.brandInfo?.brandName || '高轉換').trim().replace(/\s+/g, '_')}_高轉換銷售頁.html`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}
