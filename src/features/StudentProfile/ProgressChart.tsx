import { LEVELS } from '../../constants/levels';
import { type Rating } from '../../types';
import {
    type ChartBox,
    levelToY,
    buildChildPoints,
    buildClassAveragePoints,
    buildBandPath,
    toPolylinePoints,
    formatShortDate,
} from '../../utils/chartCoordinates';

const VIEWBOX_WIDTH = 320;
const VIEWBOX_HEIGHT = 130;
const CHART_BOX: ChartBox = { left: 14, top: 10, plotWidth: 292, plotHeight: 90 };
// Room on the left for the coloured level markers, when they are shown
const LEVEL_MARKER_SIZE = 8;
const LEVEL_MARKER_GUTTER = 14;
const DATE_LABEL_Y = 122;
const MAX_DATE_LABELS = 6;

const INK_COLOR = '#2E2A24';
const CLASS_AVERAGE_COLOR = '#18605C';
const GRIDLINE_COLOR = '#EFE7D8';
const LABEL_COLOR = '#8C8377';

type ProgressChartProps = {
    childRatingsOldestFirst: Rating[];
    classRatingsForCriterion: Rating[];
    showClassAverage: boolean;
    // Coloured squares on the y-axis showing which gridline is which level
    showLevelMarkers?: boolean;
};

function ProgressChart({
    childRatingsOldestFirst,
    classRatingsForCriterion,
    showClassAverage,
    showLevelMarkers = false,
}: ProgressChartProps) {
    const chartBox: ChartBox = showLevelMarkers
        ? {
              ...CHART_BOX,
              left: CHART_BOX.left + LEVEL_MARKER_GUTTER,
              plotWidth: CHART_BOX.plotWidth - LEVEL_MARKER_GUTTER,
          }
        : CHART_BOX;
    const childPoints = buildChildPoints(childRatingsOldestFirst, chartBox);
    const classAveragePoints = buildClassAveragePoints(
        childRatingsOldestFirst,
        classRatingsForCriterion,
        chartBox,
    );
    const lastPointIndex = childPoints.length - 1;
    // With many ratings, label every Nth date (always the newest) so labels don't collide
    const labelEveryNth = Math.ceil(childPoints.length / MAX_DATE_LABELS);

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            width="100%"
            role="img"
            aria-label={
                showClassAverage
                    ? 'Rating trend compared with the class average'
                    : 'Rating trend'
            }
        >
            {([1, 2, 3, 4] as const).map((gridLevel) => (
                <line
                    key={gridLevel}
                    x1={chartBox.left}
                    x2={chartBox.left + chartBox.plotWidth}
                    y1={levelToY(gridLevel, chartBox)}
                    y2={levelToY(gridLevel, chartBox)}
                    stroke={GRIDLINE_COLOR}
                    strokeWidth={1}
                />
            ))}
            {showLevelMarkers &&
                ([1, 2, 3, 4] as const).map((markerLevel) => (
                    <rect
                        key={`marker-${markerLevel}`}
                        x={2}
                        y={levelToY(markerLevel, chartBox) - LEVEL_MARKER_SIZE / 2}
                        width={LEVEL_MARKER_SIZE}
                        height={LEVEL_MARKER_SIZE}
                        rx={2}
                        fill={LEVELS[markerLevel].hex}
                    />
                ))}

            {/* Rendered conditionally (not hidden with CSS) so the printed page matches the screen */}
            {showClassAverage && (
                <>
                    <path
                        d={buildBandPath(classAveragePoints, chartBox)}
                        fill={CLASS_AVERAGE_COLOR}
                        fillOpacity={0.08}
                    />
                    <polyline
                        points={toPolylinePoints(classAveragePoints)}
                        fill="none"
                        stroke={CLASS_AVERAGE_COLOR}
                        strokeOpacity={0.5}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                    />
                </>
            )}

            <polyline
                points={toPolylinePoints(childPoints)}
                fill="none"
                stroke={INK_COLOR}
                strokeWidth={2}
                strokeLinejoin="round"
            />
            {childPoints.map((point, pointIndex) => (
                <circle
                    key={`${point.createdAt}-${pointIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r={pointIndex === lastPointIndex ? 5.5 : 4}
                    fill={LEVELS[point.level].hex}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                />
            ))}

            {childPoints.map((point, pointIndex) => {
                const isLabelled =
                    (lastPointIndex - pointIndex) % labelEveryNth === 0;
                if (!isLabelled) return null;
                const textAnchor =
                    childPoints.length === 1
                        ? 'middle'
                        : pointIndex === 0
                          ? 'start'
                          : pointIndex === lastPointIndex
                            ? 'end'
                            : 'middle';
                return (
                    <text
                        key={`label-${point.createdAt}-${pointIndex}`}
                        x={point.x}
                        y={DATE_LABEL_Y}
                        textAnchor={textAnchor}
                        fontSize={9}
                        fill={LABEL_COLOR}
                    >
                        {formatShortDate(point.createdAt)}
                    </text>
                );
            })}
        </svg>
    );
}

export default ProgressChart;
