import React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getConceptById, ContentBlock, ProbabilityConcept } from '../data/probabilityConceptsData';
import { exercisesByConceptId } from '../data/exercisesData';
import { pythonExercisesByConceptId } from '../data/pythonExercisesData';
import { pythonLabsByConceptId } from '../data/pythonLabsData';
import { ExercisePanel } from '../components/ExercisePanel';
import { PythonLabPanel } from '../components/PythonLabPanel';
import { PythonExercisePanel } from '../components/PythonExercisePanel';
import { useProgress } from '../contexts/ProgressContext';
import { VizCoinFlip }           from '../visualizations/VizCoinFlip';
import { VizVennDiagram }        from '../visualizations/VizVennDiagram';
import { VizInclusionExclusion } from '../visualizations/VizInclusionExclusion';
import { VizBinomial }           from '../visualizations/VizBinomial';
import { VizBayes }              from '../visualizations/VizBayes';
import { VizContinuity }         from '../visualizations/VizContinuity';
import { VizWeather, VizFairCoin, VizThreeCoins, VizUniform } from '../visualizations/VizWorkedExamples';
import { VizLottery, VizRedCard, VizLargeNumbers } from '../visualizations/VizIntroExamples';
import { VizComplementRule, VizLawOfTotalProbability, VizMonotonicity, VizSubadditivity } from '../visualizations/VizProperties';
import { VizUniformDie, VizMultiplication, VizPermutations, VizMultinomial } from '../visualizations/VizUniformProbability';
import { VizConditionalProbability, VizMultiplicationFormula, VizTotalProbability, VizIndependence } from '../visualizations/VizConditionalProbability';
import { VizRandomVariableDie, VizIndicatorFunction, VizArithmeticOperations } from '../visualizations/VizRandomVariables';
import { VizDistributionCoin, VizEqualDistributions } from '../visualizations/VizDistributions';
import { VizBernoulli, VizBinomialQuality, VizGeometric, VizPoisson, VizHypergeometric } from '../visualizations/VizDiscreteDistributions';
import { VizContinuousArea, VizContinuousUniform, VizContinuousExponential, VizContinuousGamma, VizContinuousNormal } from '../visualizations/VizContinuousDistributions';
import { VizCDFDefinition, VizCDFIntervals, VizCDFExponential, VizCDFNormal } from '../visualizations/VizCDF';
import { VizCovSquaring, VizCovIncreasing, VizCovDecreasing } from '../visualizations/VizChangeOfVariable';
import { VizJointPMF, VizMarginalDist, VizJointDensity, VizBivariateNormal } from '../visualizations/VizJointDistributions';
import { VizConditionalDiscrete, VizConditionalContinuous, VizIndependenceCheck, VizIIDTrials } from '../visualizations/VizConditioningIndependence';
import { VizSumDifference, VizJacobianDet, VizConvolution } from '../visualizations/VizMultidimCov';
import { VizDiscreteSimulation, VizInverseCDF, VizBoxMuller } from '../visualizations/VizSimulatingDistributions';
import {
  VizDiscreteExpectation,
  VizStPetersburg,
  VizContinuousExpectation,
  VizVarianceSpread,
  VizCovarianceSign,
  VizMGFTable,
  VizConditionalMean,
  VizTotalExpectation,
  VizMarkovBound,
  VizChebyshevBound,
  VizJensenInequality,
  VizDistributionEVCompare,
  VizLOTUSDemo,
  VizLinearityDemo,
  VizRunningAverage,
  VizRiemannExpectation,
  VizContinuousDistMeans,
  VizContinuousLOTUS,
  VizVarianceScaling,
  VizBernoulliVarianceCurve,
  VizCovarianceDecomposition,
  VizVarianceSumBreakdown,
  VizPGFCoefficients,
  VizMGFShape,
  VizMGFProductRule,
  VizCompoundPoisson,
  VizConditionalEventUpdate,
  VizConditionalBarChart,
  VizTowerProperty,
  VizTotalVarianceDecomp,
  VizMarkovTightness,
  VizChebyshevComparison,
  VizCauchySchwarz,
  VizJensenFunctions,
} from '../visualizations/VizExpectation';
import 'katex/dist/katex.min.css';

const VIZ_REGISTRY: Record<string, React.ComponentType> = {
  'coin-flip':           VizCoinFlip,
  'venn-diagram':        VizVennDiagram,
  'inclusion-exclusion': VizInclusionExclusion,
  'binomial':            VizBinomial,
  'bayes':               VizBayes,
  'continuity':          VizContinuity,
  'viz-weather':         VizWeather,
  'viz-fair-coin':       VizFairCoin,
  'viz-three-coins':     VizThreeCoins,
  'viz-uniform':         VizUniform,
  'viz-lottery':         VizLottery,
  'viz-red-card':        VizRedCard,
  'viz-large-numbers':   VizLargeNumbers,
  'viz-complement':      VizComplementRule,
  'viz-law-total-prob':  VizLawOfTotalProbability,
  'viz-monotonicity':    VizMonotonicity,
  'viz-subadditivity':   VizSubadditivity,
  'viz-uniform-die':     VizUniformDie,
  'viz-multiplication':  VizMultiplication,
  'viz-permutations':    VizPermutations,
  'viz-multinomial':     VizMultinomial,
  'viz-conditional':     VizConditionalProbability,
  'viz-mult-formula':    VizMultiplicationFormula,
  'viz-total-prob-cond': VizTotalProbability,
  'viz-independence':    VizIndependence,
  'viz-rv-die':          VizRandomVariableDie,
  'viz-indicator':       VizIndicatorFunction,
  'viz-arithmetic':      VizArithmeticOperations,
  'viz-dist-coin':       VizDistributionCoin,
  'viz-equal-dist':      VizEqualDistributions,
  'viz-bernoulli':       VizBernoulli,
  'viz-binomial-qual':   VizBinomialQuality,
  'viz-geometric':       VizGeometric,
  'viz-poisson':         VizPoisson,
  'viz-hypergeometric':  VizHypergeometric,
  'viz-cont-area':       VizContinuousArea,
  'viz-cont-uniform':    VizContinuousUniform,
  'viz-cont-exp':        VizContinuousExponential,
  'viz-cont-gamma':      VizContinuousGamma,
  'viz-cont-normal':     VizContinuousNormal,
  'viz-cdf-def':         VizCDFDefinition,
  'viz-cdf-intervals':   VizCDFIntervals,
  'viz-cdf-exp':         VizCDFExponential,
  'viz-cdf-normal':      VizCDFNormal,
  'viz-cov-square':      VizCovSquaring,
  'viz-cov-inc':         VizCovIncreasing,
  'viz-cov-dec':         VizCovDecreasing,
  'viz-joint-pmf':       VizJointPMF,
  'viz-marginal':        VizMarginalDist,
  'viz-joint-density':   VizJointDensity,
  'viz-biv-normal':      VizBivariateNormal,
  'viz-cond-disc':       VizConditionalDiscrete,
  'viz-cond-cont':       VizConditionalContinuous,
  'viz-indep-check':     VizIndependenceCheck,
  'viz-iid-trials':      VizIIDTrials,
  'viz-sum-diff':        VizSumDifference,
  'viz-jacobian':        VizJacobianDet,
  'viz-convolution':     VizConvolution,
  'viz-discrete-sim':    VizDiscreteSimulation,
  'viz-inverse-cdf':     VizInverseCDF,
  'viz-box-muller':      VizBoxMuller,
  // Chapter 3 — Expectation
  'viz-discrete-expectation':   VizDiscreteExpectation,
  'viz-st-petersburg':          VizStPetersburg,
  'viz-continuous-expectation': VizContinuousExpectation,
  'viz-variance-spread':        VizVarianceSpread,
  'viz-covariance-sign':        VizCovarianceSign,
  'viz-mgf-table':              VizMGFTable,
  'viz-conditional-mean':       VizConditionalMean,
  'viz-total-expectation':      VizTotalExpectation,
  'viz-markov-bound':           VizMarkovBound,
  'viz-chebyshev-bound':        VizChebyshevBound,
  'viz-jensen-inequality':      VizJensenInequality,
  'viz-distribution-ev-compare': VizDistributionEVCompare,
  'viz-lotus-demo':             VizLOTUSDemo,
  'viz-linearity-demo':         VizLinearityDemo,
  'viz-running-average':        VizRunningAverage,
  'viz-riemann-expectation':    VizRiemannExpectation,
  'viz-continuous-dist-means':  VizContinuousDistMeans,
  'viz-continuous-lotus':       VizContinuousLOTUS,
  'viz-variance-scaling':           VizVarianceScaling,
  'viz-bernoulli-variance-curve':   VizBernoulliVarianceCurve,
  'viz-covariance-decomposition':   VizCovarianceDecomposition,
  'viz-variance-sum-breakdown':     VizVarianceSumBreakdown,
  'viz-pgf-coefficients':           VizPGFCoefficients,
  'viz-mgf-shape':                  VizMGFShape,
  'viz-mgf-product-rule':           VizMGFProductRule,
  'viz-compound-poisson':           VizCompoundPoisson,
  'viz-conditional-event-update':   VizConditionalEventUpdate,
  'viz-conditional-bar-chart':      VizConditionalBarChart,
  'viz-tower-property':             VizTowerProperty,
  'viz-total-variance-decomp':      VizTotalVarianceDecomp,
  'viz-markov-tightness':           VizMarkovTightness,
  'viz-chebyshev-comparison':       VizChebyshevComparison,
  'viz-cauchy-schwarz':             VizCauchySchwarz,
  'viz-jensen-functions':           VizJensenFunctions,
};

// ── Box components ────────────────────────────────────────────────────────────

const DefinitionBox: React.FC<{ block: ContentBlock }> = ({ block }) => (
  <div style={{
    borderLeft: '4px solid var(--color-primary)',
    background: 'var(--color-surface)',
    borderRadius: '0 8px 8px 0',
    padding: 'var(--space-16)',
    margin: 'var(--space-16) 0',
  }}>
    <div style={{
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-primary)',
      marginBottom: 'var(--space-6)',
    }}>
      Definition {block.number}{block.title ? ` — ${block.title}` : ''}
    </div>
    {block.text && <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.7 }}>{block.text}</p>}
    {block.formula && (
      <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
        <BlockMath math={block.formula} />
      </div>
    )}
  </div>
);

const TheoremBox: React.FC<{ block: ContentBlock; variant: 'theorem' | 'corollary' }> = ({ block, variant }) => {
  const isCorollary = variant === 'corollary';
  const accent = isCorollary ? 'var(--color-text-secondary)' : '#8b5cf6';
  const label = isCorollary ? 'Corollary' : 'Theorem';
  return (
    <div style={{
      borderLeft: `4px solid ${accent}`,
      background: 'var(--color-surface)',
      borderRadius: '0 8px 8px 0',
      padding: 'var(--space-16)',
      margin: 'var(--space-16) 0',
    }}>
      <div style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: 'var(--space-6)',
      }}>
        {label} {block.number}{block.title ? ` — ${block.title}` : ''}
      </div>
      {block.text && <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.7 }}>{block.text}</p>}
      {block.formula && (
        <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
          <BlockMath math={block.formula} />
        </div>
      )}
    </div>
  );
};

const ExampleBox: React.FC<{ block: ContentBlock }> = ({ block }) => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: 'var(--space-16)',
    margin: 'var(--space-16) 0',
  }}>
    <div style={{
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-text-secondary)',
      marginBottom: 'var(--space-8)',
    }}>
      {block.number ? `Example ${block.number}` : 'Example'}{block.title ? ` — ${block.title}` : ''}
    </div>
    {block.body && (
      <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: 1.7 }}>{block.body}</p>
    )}
    {block.formula && (
      <div style={{ marginTop: 'var(--space-10)', overflowX: 'auto' }}>
        <BlockMath math={block.formula} />
      </div>
    )}
  </div>
);

const FormulaBlock: React.FC<{ block: ContentBlock }> = ({ block }) => (
  <div style={{
    padding: 'var(--space-12) var(--space-16)',
    margin: 'var(--space-12) 0',
    overflowX: 'auto',
    textAlign: 'center',
  }}>
    {block.latex && <BlockMath math={block.latex} />}
    {block.label && (
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
        {block.label}
      </div>
    )}
  </div>
);

// ── Block dispatcher ──────────────────────────────────────────────────────────

const renderBlock = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case 'text':
      return (
        <p key={index} style={{
          color: 'var(--color-text)',
          lineHeight: 1.8,
          margin: 'var(--space-12) 0',
          whiteSpace: 'pre-line',
        }}>
          {block.content}
        </p>
      );
    case 'formula':
      return <FormulaBlock key={index} block={block} />;
    case 'definition':
      return <DefinitionBox key={index} block={block} />;
    case 'theorem':
      return <TheoremBox key={index} block={block} variant="theorem" />;
    case 'corollary':
      return <TheoremBox key={index} block={block} variant="corollary" />;
    case 'example':
      return <ExampleBox key={index} block={block} />;
    case 'viz': {
      const VizComp = block.vizId ? VIZ_REGISTRY[block.vizId] : null;
      return VizComp ? <VizComp key={index} /> : null;
    }
    default:
      return null;
  }
};

// ── Section nav item ──────────────────────────────────────────────────────────

const SectionNavItem: React.FC<{ heading: string; index: number }> = ({ heading, index }) => (
  <a
    href={`#section-${index}`}
    style={{
      display: 'block',
      fontSize: '0.82rem',
      color: 'var(--color-text-secondary)',
      textDecoration: 'none',
      padding: 'var(--space-4) 0',
      lineHeight: 1.4,
      transition: 'color 0.15s',
    }}
    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
  >
    {heading}
  </a>
);

// ── Main page ─────────────────────────────────────────────────────────────────

export const ConceptContent: React.FC<{ concept: ProbabilityConcept; backHref: string }> = ({ concept, backHref }) => {
  const { markComplete, getNextTopic, isCompleted } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const headings = concept.sections.filter(s => s.heading).map(s => s.heading!);

  return (
    <div style={{ maxWidth: 'var(--container-2xl)', margin: '0 auto', padding: '0 var(--space-24)' }}>

      {/* Back link */}
      <div style={{ paddingTop: 'var(--space-24)', marginBottom: 'var(--space-16)' }}>
        <Link
          to={backHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} /> Back to Hub
        </Link>
      </div>

      {/* Hero header */}
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: 'var(--space-24)',
        marginBottom: 'var(--space-32)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-12)',
        }}>
          <BookOpen size={13} /> {concept.chapterRef}
        </div>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.2,
          margin: 0,
        }}>
          {concept.title}
        </h1>
        <p style={{
          marginTop: 'var(--space-12)',
          fontSize: '1.05rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          maxWidth: '680px',
        }}>
          {concept.description}
        </p>
      </div>

      {/* Two-column layout: ToC sidebar + content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 200px',
        gap: 'var(--space-48)',
        alignItems: 'start',
      }}>

        {/* Main content */}
        <main>
          {concept.sections.map((section, sIdx) => (
            <div key={sIdx} id={`section-${sIdx}`} style={{ marginBottom: 'var(--space-48)' }}>
              {section.heading && (
                <h2 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-16)',
                  paddingBottom: 'var(--space-8)',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  {section.heading}
                </h2>
              )}
              {section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
            </div>
          ))}
        </main>

        {/* Table of Contents sidebar */}
        <aside style={{
          position: 'sticky',
          top: '80px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: 'var(--space-16)',
        }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-10)',
          }}>
            Contents
          </div>
          {headings.map((h, i) => <SectionNavItem key={i} heading={h} index={i} />)}
        </aside>
      </div>

      {/* Python Lab — pre-coded demos with matplotlib */}
      <PythonLabPanel demos={pythonLabsByConceptId[concept.id] ?? []} />

      {/* Maths exercises */}
      <ExercisePanel exercises={exercisesByConceptId[concept.id] ?? []} />

      {/* Python exercises */}
      <PythonExercisePanel exercises={pythonExercisesByConceptId[concept.id] ?? []} />

      {/* Bottom nav to other concepts */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        marginTop: 'var(--space-48)',
        paddingTop: 'var(--space-24)',
        paddingBottom: 'var(--space-48)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link
          to={backHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
            fontSize: '0.9rem',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Back to Hub
        </Link>

        <button
          className="btn btn-primary hover-lift"
          onClick={() => {
            markComplete(currentPath);
            const nextTopic = getNextTopic(currentPath);
            if (nextTopic) {
              navigate(nextTopic);
            } else {
              navigate('/');
            }
          }}
        >
          {isCompleted(currentPath) ? 'Continue to Next' : 'Mark as Complete & Continue'}
        </button>
      </div>

    </div>
  );
};

export const ProbabilityConceptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const concept = id ? getConceptById(id) : undefined;

  if (!concept) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '80px auto',
        textAlign: 'center',
        padding: '0 var(--space-24)',
      }}>
        <h2 style={{ color: 'var(--color-text)', marginBottom: 'var(--space-12)' }}>
          Concept not found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-24)' }}>
          No concept with id "{id}" exists.
        </p>
        <Link
          to="/"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          ← Back to Hub
        </Link>
      </div>
    );
  }

  return <ConceptContent concept={concept} backHref="/#concepts" />;
};
