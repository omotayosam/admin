'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { athleteService } from '@/features/athletes/service/athlete.service';

type SportKey =
  | 'boxing'
  | 'basketball'
  | 'football'
  | 'athletics'
  | 'wrestling';
type SportTypeApi =
  | 'BOXING'
  | 'BASKETBALL'
  | 'FOOTBALL'
  | 'ATHLETICS'
  | 'WRESTLING';

const sportKeyToApi: Record<SportKey, SportTypeApi> = {
  boxing: 'BOXING',
  basketball: 'BASKETBALL',
  football: 'FOOTBALL',
  athletics: 'ATHLETICS',
  wrestling: 'WRESTLING'
};

const initialChartData: { sport: SportKey; athletes: number; fill: string }[] =
  [
    { sport: 'boxing', athletes: 0, fill: 'var(--primary)' },
    { sport: 'basketball', athletes: 0, fill: 'var(--primary-light)' },
    { sport: 'football', athletes: 0, fill: 'var(--primary-lighter)' },
    { sport: 'athletics', athletes: 0, fill: 'var(--primary-dark)' },
    { sport: 'wrestling', athletes: 0, fill: 'var(--primary-darker)' }
  ];

const chartConfig = {
  athletes: {
    label: 'Athletes'
  },
  boxing: { label: 'Boxing', color: 'var(--primary)' },
  basketball: { label: 'Basketball', color: 'var(--primary)' },
  football: { label: 'Football', color: 'var(--primary)' },
  athletics: { label: 'Athletics', color: 'var(--primary)' },
  wrestling: { label: 'Wrestling', color: 'var(--primary)' }
} satisfies ChartConfig;

export function PieGraph() {
  const [chartData, setChartData] = React.useState(initialChartData);
  const totalAthletes = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.athletes, 0);
  }, [chartData]);

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const sportKeys: SportKey[] = [
          'boxing',
          'basketball',
          'football',
          'athletics',
          'wrestling'
        ];
        const results = await Promise.all(
          sportKeys.map(async (key) => {
            const res = await athleteService.getAllAthletes({
              sportType: sportKeyToApi[key],
              page: '1',
              limit: '1'
            });
            // Prefer total if present, else fall back to returned data length
            const total =
              (res as any)?.total ??
              (Array.isArray(res?.data) ? res.data.length : 0);
            return { key, total } as { key: SportKey; total: number };
          })
        );

        setChartData((prev) =>
          prev.map((item) => {
            const found = results.find((r) => r.key === item.sport);
            return found ? { ...item, athletes: found.total } : item;
          })
        );
      } catch (e) {
        // Keep zeros on failure
        console.error('Failed to load athlete counts by sport', e);
      }
    };
    fetchCounts();
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Athletes by Sport</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Distribution of athletes across sports
          </span>
          <span className='@[540px]/card:hidden'>Sports distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {[
                'boxing',
                'basketball',
                'football',
                'athletics',
                'wrestling'
              ].map((sport, index) => (
                <linearGradient
                  key={sport}
                  id={`fill${sport}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--primary)'
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8 - index * 0.15}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.sport})`
              }))}
              dataKey='athletes'
              nameKey='sport'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalAthletes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Athletes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {totalAthletes > 0 && (
          <div className='flex items-center gap-2 leading-none font-medium'>
            {(() => {
              const byPercent = chartData
                .map((d) => ({
                  key: d.sport,
                  pct: (d.athletes / totalAthletes) * 100
                }))
                .sort((a, b) => b.pct - a.pct);
              const top = byPercent[0];
              const labelMap: Record<SportKey, string> = {
                boxing: 'Boxing',
                basketball: 'Basketball',
                football: 'Football',
                athletics: 'Athletics',
                wrestling: 'Wrestling'
              };
              return `${labelMap[top.key]} leads with ${top.pct.toFixed(1)}%`;
            })()}{' '}
            <IconTrendingUp className='h-4 w-4' />
          </div>
        )}
        <div className='text-muted-foreground leading-none'>
          Live counts by sport from the athletes database
        </div>
      </CardFooter>
    </Card>
  );
}
