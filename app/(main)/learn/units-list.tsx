&#39;use client&#39;;

import { useState, useEffect, useRef, useCallback } from &#39;react&#39;;

import { UnitBanner } from &#39;./unit-banner&#39;;
import { Unit } from &#39;./unit&#39;;
import { UnitDivider } from &#39;./unit-divider&#39;;

type LessonType = {
  id: number;
  title: string;
  order: number;
  completed: boolean;
  subject?: string | null;
  unitId?: number;
};

type UnitType = {
  id: number;
  order: number;
  title: string;
  lessons: LessonType[];
};

type ActiveLessonType = {
  id: number;
  unit: UnitType;
} | undefined;

interface UnitsListProps {
  units: UnitType[];
  activeLessonPercentage: number;
  activeLesson: ActiveLessonType;
}

export const UnitsList = ({ units, activeLessonPercentage, activeLesson }: UnitsListProps) =&gt; {
  const [currentUnit, setCurrentUnit] = useState(units[0]);
  const unitRefs = useRef&lt;(HTMLDivElement | null)[]&gt;([]);

  const updateCurrentUnit = useCallback((entries: IntersectionObserverEntry[]) =&gt; {
    let visibleEntries: IntersectionObserverEntry[] = [];
    entries.forEach((entry) =&gt; {
      if (entry.isIntersecting) {
        visibleEntries.push(entry);
      }
    });
    if (visibleEntries.length &gt; 0) {
      // Sort by top position (smallest top first)
      visibleEntries.sort((a, b) =&gt; (a.boundingClientRect.top - b.boundingClientRect.top));
      const topEntry = visibleEntries[0];
      const index = unitRefs.current.indexOf(topEntry.target as HTMLDivElement);
      if (index !== -1 &amp;&amp; units[index]) {
        setCurrentUnit(units[index]);
      }
    }
  }, [units]);

  useEffect(() =&gt; {
    const observer = new IntersectionObserver(
      updateCurrentUnit,
      {
        root: null,
        rootMargin: &#39;-56px 0px -50% 0px&#39;,
        threshold: 0
      }
    );

    unitRefs.current.forEach((ref) =&gt; {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () =&gt; {
      observer.disconnect();
    };
  }, [updateCurrentUnit]);

  if (!units.length) return null;

  return (
    &lt;&gt;
      &lt;UnitBanner 
        unitOrder={currentUnit?.order || 1} 
        totalUnits={units.length} 
        title={currentUnit?.title || &#39;&#39;} 
      /&gt;
      {units.map((unit, i) =&gt; (
        &lt;&gt;
          &lt;div 
            key={unit.id} 
            ref={(el) =&gt; { unitRefs.current[i] = el; }}
            className="mb-10"
          &gt;
            &lt;Unit
              id={unit.id}
              order={unit.order}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={activeLesson}
              activeLessonPercentage={activeLessonPercentage}
            /&gt;
          &lt;/div&gt;
          {i &lt; units.length - 1 &amp;&amp; (
            &lt;UnitDivider&gt;
              Unidade {units[i + 1].order}
            &lt;/UnitDivider&gt;
          )}
        &lt;/&gt;
      ))}
    &lt;/&gt;
  );
};