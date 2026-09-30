import { type Rating } from '../types';

export type ChartBox = {
    left: number;
    top: number;
    plotWidth: number;
    plotHeight: number;
};

export type ChildChartPoint = {
    x: number;
    y: number;
    level: Rating['level'];
    createdAt: string;
};

export type ClassAverageChartPoint = {
    x: number;
    y: number;
    averageLevel: number;
};

// Level 4 sits on the top gridline, level 1 on the bottom one
export function levelToY(level: number, chartBox: ChartBox) {
    return chartBox.top + ((4 - level) / 3) * chartBox.plotHeight;
}

// Ratings are spread evenly across the width, oldest on the left. A single rating is centred.
function indexToX(pointIndex: number, pointCount: number, chartBox: ChartBox) {
    if (pointCount === 1) return chartBox.left + chartBox.plotWidth / 2;
    return chartBox.left + (pointIndex / (pointCount - 1)) * chartBox.plotWidth;
}

export function sortOldestFirst(ratings: Rating[]) {
    return [...ratings].sort(
        (earlierRating, laterRating) =>
            new Date(earlierRating.created_at).getTime() -
            new Date(laterRating.created_at).getTime(),
    );
}

export function buildChildPoints(
    childRatingsOldestFirst: Rating[],
    chartBox: ChartBox,
): ChildChartPoint[] {
    return childRatingsOldestFirst.map((rating, pointIndex) => ({
        x: indexToX(pointIndex, childRatingsOldestFirst.length, chartBox),
        y: levelToY(rating.level, chartBox),
        level: rating.level,
        createdAt: rating.created_at,
    }));
}

// At each of the child's rating dates: take every classmate's newest rating for this
// criterion made on or before that date, and average them. Classmates with no rating yet
// are left out; dates where nobody has been rated get no class-average point.
export function buildClassAveragePoints(
    childRatingsOldestFirst: Rating[],
    classRatingsForCriterion: Rating[],
    chartBox: ChartBox,
): ClassAverageChartPoint[] {
    const classAveragePoints: ClassAverageChartPoint[] = [];

    childRatingsOldestFirst.forEach((childRating, pointIndex) => {
        const pointTime = new Date(childRating.created_at).getTime();
        const newestRatingByStudent = new Map<number, Rating>();

        for (const classRating of classRatingsForCriterion) {
            const ratingTime = new Date(classRating.created_at).getTime();
            if (ratingTime > pointTime) continue;
            const newestSoFar = newestRatingByStudent.get(classRating.student_id);
            if (
                !newestSoFar ||
                ratingTime > new Date(newestSoFar.created_at).getTime()
            ) {
                newestRatingByStudent.set(classRating.student_id, classRating);
            }
        }

        if (newestRatingByStudent.size === 0) return;

        const levelTotal = [...newestRatingByStudent.values()].reduce(
            (runningTotal, rating) => runningTotal + rating.level,
            0,
        );
        const averageLevel = levelTotal / newestRatingByStudent.size;

        classAveragePoints.push({
            x: indexToX(pointIndex, childRatingsOldestFirst.length, chartBox),
            y: levelToY(averageLevel, chartBox),
            averageLevel,
        });
    });

    return classAveragePoints;
}

export function toPolylinePoints(points: { x: number; y: number }[]) {
    return points.map((point) => `${point.x},${point.y}`).join(' ');
}

// Faded area under the class-average line, down to the level-1 gridline
export function buildBandPath(
    classAveragePoints: ClassAverageChartPoint[],
    chartBox: ChartBox,
) {
    if (classAveragePoints.length === 0) return '';
    const baselineY = chartBox.top + chartBox.plotHeight;
    const firstPoint = classAveragePoints[0];
    const lastPoint = classAveragePoints[classAveragePoints.length - 1];
    const lineSegments = classAveragePoints
        .map((point) => `L ${point.x} ${point.y}`)
        .join(' ');
    return `M ${firstPoint.x} ${baselineY} ${lineSegments} L ${lastPoint.x} ${baselineY} Z`;
}

export function formatShortDate(isoDate: string) {
    return new Date(isoDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}
