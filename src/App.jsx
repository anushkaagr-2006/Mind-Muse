import clickSound from './assets/click.mp3';
import correctSound from './assets/correct.mp3';
import completeSound from './assets/complete.mp3';
import logo from './assets/MML.png';


const clickAudio = new Audio(clickSound);
const correctAudio = new Audio(correctSound);
const completeAudio = new Audio(completeSound);

import { useState } from 'react';
import questions from './questions';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';


function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isStartScreen, setIsStartScreen] = useState(true);
const [showRules, setShowRules] = useState(false);



  const handleOptionClick = (option) => {
    clickAudio.play();
    setSelectedOption(option);
    const correct = option === questions[currentQuestion].answer;
    setIsCorrect(correct);
  
    // ✅ Store user answer for summary
    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQuestion].question,
        selected: option,
        correctAnswer: questions[currentQuestion].answer,
        isCorrect: correct,
      }
    ]);
  
    if (correct) {
      correctAudio.play();
      setScore(score + 1);
    }
  };
  
  

  const handleNext = () => {
    clickAudio.play();
    const nextQ = currentQuestion + 1;
    if (nextQ < questions.length) {
      setCurrentQuestion(nextQ);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      completeAudio.play();
      setShowResult(true);
    }
  };
  

  const handleRestart = () => {
    clickAudio.play();
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setUserAnswers([]);

  };
  

  return (
    <div className="App">
  
      {isStartScreen ? (
        // 🌸 START SCREEN
        
        <div className="start-screen">
          <img src= {logo} alt="Mind Muse Logo" className="intro-banner" />

          <h1>🌟 Welcome to Mind Muse 🌟</h1>
          <p className="tagline">Challenge Yourself!!</p>
  
          <div className="start-buttons">
            <button onClick={() => setShowRules(true)}>📜 Rules</button>
            <button onClick={() => setIsStartScreen(false)}>▶️ Start Quiz</button>
          </div>
  
          {showRules && (
            <div className="rules-popup">
              <h3>📋 Rules:</h3>
              <ul>
                <li>You'll get 10 multiple choice questions</li>
                <li>Select one answer per question</li>
                <li>You’ll see instant feedback</li>
                <li>Final score & summary at the end!</li>
              </ul>
              <button onClick={() => setShowRules(false)}>❌ Close</button>
            </div>
          )}
        </div>
      ) : showResult ? (
        // 🏁 RESULT SCREEN
        <div className="question-box">
          <h2>🏁 Quiz Completed!</h2>
          <p className="final-score">💯 Your Score: {score} / {questions.length}</p>
          {score === questions.length ? (
  <p className="result-message">🌟 Perfect Score! You're a genius!</p>
) : score >= questions.length * 0.7 ? (
  <p className="result-message">🎉 Great job! You know your stuff!</p>
) : score >= questions.length * 0.4 ? (
  <p className="result-message">👍 Good effort! Keep practicing!</p>
) : (
  <p className="result-message">😢 Don't worry, try again!</p>
)}

  
          <div className="summary-section">
            <h3>📝 Summary:</h3>
            {userAnswers.map((item, index) => (
              <div key={index} className="summary-card">
                <p><strong>Q{index + 1}:</strong> {item.question}</p>
                <p>
                  Your Answer: <span className={item.isCorrect ? "correct-answer" : "wrong-answer"}>
                    {item.selected}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p>
                    Correct Answer: <span className="correct-answer">{item.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
  
          <button onClick={handleRestart}>🔄 Restart Quiz</button>
        </div>
        
      ) : (
        // ❓ QUIZ SCREEN
        <AnimatePresence mode="wait">
          <div className="progress-bar">
  <div
    className="progress"
    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
  ></div>
</div>


          <motion.div
            key={currentQuestion}
            className="question-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <p className="score-tracker">🧠 Score: {score} / {questions.length}</p>
            <h2>Question {currentQuestion + 1} of {questions.length}</h2>
            <p className="question-text">{questions[currentQuestion].question}</p>

            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={selectedOption === option ? (isCorrect ? 'correct' : 'wrong') : ''}
                  disabled={selectedOption}
                >
                  {option}
                </button>
              ))}
            </div>
  
            {selectedOption && (
              <>
                <div className={`feedback-card ${isCorrect ? 'correct-card' : 'wrong-card'}`}>
                  {isCorrect ? (
                    <p className="feedback-text">🎉 Correct! You're a star! 🌟</p>
                  ) : (
                    <>
                      <p className="feedback-text">😢 Oops! The correct answer was:</p>
                      <p className="feedback-answer"> {questions[currentQuestion].answer}</p>
                    </>
                  )}
                </div>
                <div className="next-button-container">
  <button onClick={handleNext} className="next-button">Next ➡️</button>
</div>

              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      <footer className="footer">
    Made with Love by <strong>Anushka</strong>
  </footer>
</div>
  );
  
}

export default App;
