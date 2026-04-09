import './style.css';
import { renderIntro } from './screens/intro';
import { renderQuiz } from './screens/quiz';
import { renderLoading } from './screens/loading';
import { renderResult } from './screens/result';
import { calculateResult } from './engine/scoring';


const app = document.querySelector<HTMLDivElement>('#app')!;

function showScreen(screen: HTMLElement): void {
  const current = app.firstElementChild;
  if (current) {
    current.classList.add('exiting');
    setTimeout(() => {
      app.innerHTML = '';
      app.appendChild(screen);
      screen.classList.add('active');
    }, 300);
  } else {
    app.appendChild(screen);
    screen.classList.add('active');
  }
}

function startApp(): void {
  // Phase 1 answers stored across phases
  let phase1Answers: Map<number, string>;

  const intro = renderIntro(() => {

    // Phase 1: Personality quiz
    const quiz1 = renderQuiz(1, {
      onPhase1Complete: (answers) => {
        phase1Answers = answers;

        // Skip transition — go directly to Phase 2 practical quiz
        const quiz2 = renderQuiz(2, {
          onPhase1Complete: () => {},
          onAllComplete: (p2Answers, multiAnswers) => {
            const allAnswers = new Map([...phase1Answers, ...p2Answers]);
            const loading = renderLoading(() => {
              const result = calculateResult(allAnswers, multiAnswers);
              const resultScreen = renderResult(result, startApp);

              showScreen(resultScreen);
            });
            showScreen(loading);
          },
        });

        showScreen(quiz2);
      },
      onAllComplete: () => {},
    });
    showScreen(quiz1);
  });
  showScreen(intro);
}



startApp();
