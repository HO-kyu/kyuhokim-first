document.addEventListener('DOMContentLoaded', () => {
    const articleViewer = document.getElementById('article-viewer');
    const articleContent = document.getElementById('article-content');
    const closeButton = document.getElementById('close-article');
    const readMoreLinks = document.querySelectorAll('.read-more');

    const articles = {
        1: {
            title: "AI 동물상 분석기: 어떻게 작동하나요?",
            content: `
                <p>저희 'Pet-Alike' 서비스의 핵심 기술인 머신러닝과 Teachable Machine에 대해 알아보고, 어떻게 여러분의 얼굴에서 동물의 특징을 찾아내는지 그 원리를 쉽게 설명해 드립니다.</p>
                <p>머신러닝은 컴퓨터가 명시적으로 프로그래밍되지 않고도 데이터로부터 학습할 수 있게 하는 인공지능의 한 분야입니다. 저희는 Google의 'Teachable Machine'이라는 도구를 사용하여, 수천 장의 '강아지', '고양이', '호랑이', '말' 이미지를 모델에 제공했습니다. 모델은 이 이미지들을 분석하여 각 동물을 구별하는 고유한 시각적 패턴(예: 귀 모양, 코의 위치, 눈의 형태 등)을 학습합니다.</p>
                <p>여러분이 이미지를 업로드하면, 모델은 학습된 패턴과 여러분의 얼굴을 비교하여 각 동물과 얼마나 유사한지를 확률로 계산합니다. 그리고 가장 높은 확률을 가진 동물을 결과로 보여주는 것입니다. 이 모든 과정은 여러분의 브라우저에서 안전하게 실행되며, 여러분의 소중한 사진은 외부로 전송되지 않습니다.</p>
            `
        },
        2: {
            title: "동물상으로 보는 성격: 당신은 댕댕이? 냥이?",
            content: `
                <p>강아지상의 사람들은 활기차고 사교적일까요? 고양이상의 사람들은 독립적이고 차분할까요? 동물상과 성격의 흥미로운 연관성에 대한 이야기를 탐구해봅니다.</p>
                <p>관상학은 과학적으로 입증된 분야는 아니지만, 우리는 종종 특정 얼굴 특징을 동물의 이미지와 연관 짓곤 합니다. 예를 들어, 크고 순한 눈, 처진 눈꼬리를 가진 사람을 '강아지상'이라고 부르며 따뜻하고 친근한 성격을 기대합니다. 반면, 날카로운 눈매와 높은 광대뼈를 가진 사람은 '고양이상'으로 불리며, 독립적이고 때로는 예측 불가능한 매력을 가졌다고 생각합니다.</p>
                <p>저희 Pet-Alike 테스트는 이러한 재미있는 사회적 인식을 기반으로 한 즐길 거리입니다. 당신의 결과는 어떤 동물상으로 나왔나요? 그 동물의 성격과 당신의 성격이 얼마나 비슷한지 비교해보는 것도 또 다른 재미가 될 것입니다!</p>
            `
        },
        3: {
            title: "AI가 뽑은 금주의 '빵 터지는' 동물 매칭",
            content: `
                <p>사용자 여러분의 재미있는 AI 동물상 매칭 결과를 소개합니다! 이번 주에는 어떤 놀랍고 재미있는 결과들이 있었을까요? 여러분도 최고의 매칭에 도전해보세요.</p>
                <p><strong>사례 1: 잠자는 아기와 '호랑이' (정확도 78%)</strong><br>새근새근 잠자는 아기의 얼굴에서 용맹한 호랑이의 기운이 느껴진다는 AI의 판단! 아마도 편안하게 웅크린 모습이 아기 호랑이를 연상시켰나 봅니다.</p>
                <p><strong>사례 2: 무표정한 친구와 '말' (정확도 85%)</strong><br>조금은 길어 보이는 얼굴형 때문이었을까요? 친구는 결과를 보고 한참을 웃었다는 후문입니다. 여러분도 친구들과 함께 테스트하며 즐거운 추억을 만들어보세요!</p>
                <p>여러분의 재미있는 결과를 소셜 미디어에 공유하고 저희를 태그해주세요!</p>
            `
        }
    };

    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = e.target.getAttribute('data-article');
            const article = articles[articleId];
            
            if (article) {
                articleContent.innerHTML = `<h2>${article.title}</h2>${article.content}`;
                articleViewer.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    closeButton.addEventListener('click', () => {
        articleViewer.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close article viewer if clicking outside the content
    articleViewer.addEventListener('click', (e) => {
        if (e.target === articleViewer) {
            articleViewer.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});
