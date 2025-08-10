'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
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

export const description = 'Daily athlete registrations (last 30 days)';

type RegistrationPoint = { date: string; male: number; female: number };

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildLastNDays(n: number): RegistrationPoint[] {
  const arr: RegistrationPoint[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push({ date: formatDateKey(d), male: 0, female: 0 });
  }
  return arr;
}

const chartConfig = {
  male: {
    label: 'Male',
    color: 'var(--primary)'
  },
  female: {
    label: 'Female',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('male');

  const [chartData, setChartData] = React.useState<RegistrationPoint[]>(
    buildLastNDays(30)
  );
  const [isClient, setIsClient] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        // Fetch up to 1000 most recent athletes
        const res = await athleteService.getAllAthletes({
          page: '1',
          limit: '1000'
        });
        const athletes = res.data || [];

        // Map date buckets
        const buckets: Record<string, { male: number; female: number }> = {};
        const base = buildLastNDays(30);
        base.forEach((p) => (buckets[p.date] = { male: 0, female: 0 }));

        for (const a of athletes as any[]) {
          const createdAt = a.createdAt || a.created_at;
          if (!createdAt) continue;
          const d = new Date(createdAt);
          const key = formatDateKey(d);
          if (buckets[key]) {
            if (a.gender === 'MALE') buckets[key].male += 1;
            else if (a.gender === 'FEMALE') buckets[key].female += 1;
          }
        }

        const filled = base.map((p) => ({
          date: p.date,
          male: buckets[p.date]?.male ?? 0,
          female: buckets[p.date]?.female ?? 0
        }));
        setChartData(filled);
      } catch (e) {
        console.error('Failed to load athlete registrations', e);
        setChartData(buildLastNDays(30));
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const total = React.useMemo(
    () => ({
      male: chartData.reduce((acc, curr) => acc + curr.male, 0),
      female: chartData.reduce((acc, curr) => acc + curr.female, 0)
    }),
    [chartData]
  );

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Athlete Registrations</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>Last 30 days</span>
            <span className='@[540px]/card:hidden'>Last 30 days</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {(['male', 'female'] as Array<keyof typeof chartConfig>).map(
            (chart) => {
              if (!chart || total[chart] === 0) return null;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                  onClick={() => setActiveChart(chart)}
                >
                  <span className='text-muted-foreground text-xs'>
                    {chartConfig[chart].label}
                  </span>
                  <span className='text-lg leading-none font-bold sm:text-3xl'>
                    {total[chart]?.toLocaleString()}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
