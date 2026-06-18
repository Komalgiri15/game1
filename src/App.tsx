import { useState } from 'react'
import type { AvatarId, BustedMyth, DifficultyId, FinalTruthPart, GamePhase, RunStats } from './game/types'
import { DIFFICULTY_LEVELS, STAGES } from './game/constants'
import { getNextDifficulty, pickFinalTruthPair } from './game/helpers'
import type { StageGiftReward } from './game/arcade/scoring'
import { Button } from './components/Button'
import { AvatarSelect } from './components/AvatarSelect'
import { SetupSteps } from './components/SetupSteps'
import { DifficultySelect } from './components/DifficultySelect'
import { FinalTruthIntro } from './components/FinalTruthIntro'
import { GameShell } from './components/GameShell'
import { LogoMark } from './components/LogoMark'
import { PreviewJourneyScreen } from './components/PreviewJourneyScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { StageClearTransition } from './components/StageClearTransition'
import { HowToPlayModal } from './components/HowToPlayModal'
import { ArcadeGameplayScreen } from './screens/ArcadeGameplayScreen'

const IN_GAME_PHASES: GamePhase[] = [
  'playing',
  'stage-clear',
  'final-intro',
  'final-truth',
]

const emptyStats = (): RunStats => ({
  score: 0,
  combo: 0,
  bestCombo: 0,
  xp: 0,
  gems: 0,
  mythsBusted: 0,
  badgesEarned: [],
})

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('setup-cards')
  const [difficultyId, setDifficultyId] = useState<DifficultyId | null>(null)
  const [avatarId, setAvatarId] = useState<AvatarId>('guide')

  const [stageIndex, setStageIndex] = useState(0)
  const [stagesCleared, setStagesCleared] = useState(0)
  const [clarity, setClarity] = useState(0)
  const [busted, setBusted] = useState<BustedMyth[]>([])
  const [runStats, setRunStats] = useState<RunStats>(emptyStats())
  const [resultType, setResultType] = useState<'full' | 'partial'>('partial')
  const [reachedFinalTruth, setReachedFinalTruth] = useState(false)
  const [clearedStageIndex, setClearedStageIndex] = useState(0)
  const [finalTruthParts, setFinalTruthParts] = useState<FinalTruthPart[]>([])
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === difficultyId)
  const maxClarity = difficulty?.startingClarity ?? 5
  const nextDifficulty = difficultyId ? getNextDifficulty(difficultyId) : null
  const inGame = IN_GAME_PHASES.includes(phase)

  const resetRun = () => {
    setPhase('setup-cards')
    setDifficultyId(null)
    setAvatarId('guide')
    setStageIndex(0)
    setStagesCleared(0)
    setBusted([])
    setRunStats(emptyStats())
    setResultType('partial')
    setReachedFinalTruth(false)
    setClearedStageIndex(0)
    setFinalTruthParts([])
    setShowHowToPlay(false)
  }

  const beginIntro = () => {
    if (!difficulty) return
    setClarity(difficulty.startingClarity)
    setBusted([])
    setRunStats(emptyStats())
    setStageIndex(0)
    setStagesCleared(0)
    setPhase('intro')
  }

  const beginPlay = () => {
    if (!difficultyId || !difficulty) return
    setClarity(difficulty.startingClarity)
    setRunStats(emptyStats())
    setStageIndex(0)
    setPhase('playing')
  }

  const handleStageComplete = (
    idx: number,
    newClarity: number,
    newBusted: BustedMyth[],
    stats: RunStats,
  ) => {
    setClarity(newClarity)
    setBusted(newBusted)
    setRunStats(stats)
    setStagesCleared(idx + 1)
    setClearedStageIndex(idx)
    if (idx < STAGES.length - 1) {
      setPhase('stage-clear')
    } else {
      setFinalTruthParts(pickFinalTruthPair(difficultyId!))
      setReachedFinalTruth(true)
      setPhase('final-intro')
    }
  }

  const afterStageClear = () => {
    setStageIndex(clearedStageIndex + 1)
    setPhase('playing')
  }

  const handleGiftClaim = (bonus: StageGiftReward) => {
    setRunStats((prev) => ({
      ...prev,
      score: prev.score + bonus.points,
      xp: prev.xp + bonus.xp,
      gems: prev.gems + bonus.gems,
    }))
  }

  const beginFinalTruth = () => setPhase('final-truth')

  const handleFinalComplete = (
    newClarity: number,
    newBusted: BustedMyth[],
    stats: RunStats,
  ) => {
    setClarity(newClarity)
    setBusted(newBusted)
    setRunStats(stats)
    setStagesCleared(3)
    setResultType('full')
    setPhase('results')
  }

  const handleClarityDepleted = (
    newBusted: BustedMyth[],
    duringFinal: boolean,
    stats: RunStats,
  ) => {
    setBusted(newBusted)
    setRunStats(stats)
    setClarity(0)
    if (duringFinal) setReachedFinalTruth(true)
    setResultType('partial')
    setPhase('results')
  }

  const goDeeper = () => {
    if (!nextDifficulty) return
    setDifficultyId(nextDifficulty)
    const d = DIFFICULTY_LEVELS.find((x) => x.id === nextDifficulty)!
    setClarity(d.startingClarity)
    setBusted([])
    setRunStats(emptyStats())
    setStageIndex(0)
    setStagesCleared(0)
    setResultType('partial')
    setReachedFinalTruth(false)
    setPhase('playing')
  }

  return (
    <div className={`app ${inGame ? 'app--in-game' : ''}`}>
      {!inGame && (
        <>
          <div className="app-glow app-glow--rose" aria-hidden />
          <div className="app-glow app-glow--lavender" aria-hidden />
        </>
      )}

      {phase === 'setup-cards' && (
        <div className="screen screen--setup">
          <LogoMark />
          <header className="screen-header">
            <h1 className="headline-lg">Menopause Myth Busters</h1>
            <p className="body-md tagline">
              Move, tap, and collect your way through the menopause journey.
            </p>
          </header>

          <SetupSteps current={1} />

          <section className="screen-section">
            <h2 className="headline-md section-title">Step 1 — Where are you starting?</h2>
            <p className="body-md section-sub">
              Pick the card that matches your Clarity self-check-in. This sets
              your pace and starting Clarity.
            </p>
            <DifficultySelect selected={difficultyId} onSelect={setDifficultyId} />
          </section>

          <footer className="screen-footer">
            <Button onClick={() => setPhase('setup-spirit')} disabled={!difficultyId}>
              Continue — Choose your type
            </Button>
          </footer>
        </div>
      )}

      {phase === 'setup-spirit' && (
        <div className="screen screen--setup screen--spirit">
          <LogoMark />
          <header className="screen-header screen-header--compact">
            <p className="label-caps setup-spirit-eyebrow">Step 2 of 2</p>
            <h1 className="headline-md">Choose your companion</h1>
            <p className="body-md setup-spirit-sub">
              Pick who drifts with you through the clouds — each type has its own sky.
            </p>
          </header>

          <SetupSteps current={2} />

          <section className="screen-section">
            <AvatarSelect selected={avatarId} onSelect={setAvatarId} />
          </section>

          <footer className="screen-footer screen-footer--dual">
            <Button onClick={() => setPhase('setup-cards')} variant="secondary">
              Back
            </Button>
            <Button onClick={beginIntro} variant="secondary">
              Preview Journey
            </Button>
            <Button onClick={() => setShowHowToPlay(true)}>Start Playing</Button>
          </footer>

          {showHowToPlay && (
            <HowToPlayModal
              onStart={() => {
                setShowHowToPlay(false)
                beginPlay()
              }}
              onClose={() => setShowHowToPlay(false)}
            />
          )}
        </div>
      )}

      {phase === 'intro' && difficulty && (
        <PreviewJourneyScreen
          avatarId={avatarId}
          difficulty={difficulty}
          clarity={clarity}
          maxClarity={maxClarity}
          onBegin={beginPlay}
          onBack={() => setPhase('setup-spirit')}
        />
      )}

      {inGame && difficultyId && (
        <GameShell>
          {phase === 'stage-clear' && (
            <StageClearTransition
              banner={STAGES[clearedStageIndex]?.clearBanner ?? 'Stage Understood'}
              clearedStageIndex={clearedStageIndex}
              clarity={clarity}
              runStats={runStats}
              onClaimBonus={handleGiftClaim}
              onComplete={afterStageClear}
            />
          )}

          {phase === 'final-intro' && <FinalTruthIntro onReady={beginFinalTruth} />}

          {(phase === 'playing' || phase === 'final-truth') && (
            <ArcadeGameplayScreen
              key={`${phase}-${stageIndex}-${difficultyId}`}
              difficultyId={difficultyId}
              avatarId={avatarId}
              mode={phase === 'final-truth' ? 'final-truth' : 'stage'}
              initialStageIndex={stageIndex}
              initialClarity={clarity}
              initialBusted={busted}
              initialStats={runStats}
              finalTruthParts={finalTruthParts}
              onStageComplete={handleStageComplete}
              onFinalTruthComplete={handleFinalComplete}
              onClarityDepleted={handleClarityDepleted}
            />
          )}
        </GameShell>
      )}

      {phase === 'results' && difficultyId && (
        <div className="screen screen--results">
          <div className="app-glow app-glow--rose results-glow" aria-hidden />
          <div className="app-glow app-glow--lavender results-glow results-glow--2" aria-hidden />
          <ResultsScreen
            resultType={resultType}
            bustedMyths={busted}
            clarity={clarity}
            maxClarity={maxClarity}
            stagesCleared={stagesCleared}
            reachedFinalTruth={reachedFinalTruth}
            runStats={runStats}
            canGoDeeper={nextDifficulty !== null}
            onGoDeeper={goDeeper}
            onWalkAgain={resetRun}
          />
        </div>
      )}

      {!inGame && !['setup-cards', 'setup-spirit', 'intro', 'results'].includes(phase) && (
        <footer className="app-credit">
          Based on{' '}
          <em>
            Redefining Menopause: Your Guide to Rebuilding Strength &amp; Hormonal
            Harmony
          </em>
        </footer>
      )}
    </div>
  )
}
