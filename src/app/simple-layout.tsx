import { SimpleNav } from '@/components/simple-nav';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SimpleLayout({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      <SimpleNav />
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)]'>
          <div className='flex flex-1 p-4 md:px-6'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 p-4 md:px-6'>{children}</div>
      )}
    </>
  );
}
