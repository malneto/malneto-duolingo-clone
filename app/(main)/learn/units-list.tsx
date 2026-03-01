'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import { UnitBanner } from './unit-banner';
import { Unit } from './unit';
import { UnitDivider } from './unit-divider';

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
  lessons?: LessonType[];
};

type ActiveLessonType = {
  id: number;
  unit: UnitType;
} | undefined;

interface UnitsListProps {
  units: UnitType[];
  activeLessonPercentage: number;
  activeLesson?: any;
}

export const UnitsList = ({ units, activeLessonPercentage, activeLesson }: UnitsListProps) => {
  const [currentUnit, setCurrentUnit] = useState(units[0]);
  const unitRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateCurrentUnit = useCallback((entries: IntersectionObserverEntry[]) => {
    const visibleEntries: IntersectionObserverEntry[] = [];
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleEntries.push(entry);
      }
    });
    if (visibleEntries.length > 0) {
      // Sort by top position (smallest top first)
      visibleEntries.sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));
      const topEntry = visibleEntries[0];
      const index = unitRefs.current.indexOf(topEntry.target as HTMLDivElement);
      if (index !== -1 && units[index]) {
        setCurrentUnit(units[index]);
      }
    }
  }, [units]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      updateCurrentUnit,
      {
        root: null,
        rootMargin: '-56px 0px -50% 0px',
        threshold: 0
      }
    );

    unitRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [updateCurrentUnit]);

  if (!units.length) return null;

  return (
    <>
      <UnitBanner 
        unitOrder={currentUnit?.order || 1} 
        totalUnits={units.length} 
        title={currentUnit?.title || ''} 
      />
      {units.map((unit, i) => (
        
        <div key={unit.id} 
            ref={(el) => { unitRefs.current[i] = el; }}
            className="mb-10"
          >
            <Unit
              id={unit.id}
              order={unit.order}
              title={unit.title}
              lessons={unit.lessons || []}
              activeLesson={activeLesson}
              activeLessonPercentage={activeLessonPercentage}
            />
          {i < units.length - 1 && (
            <UnitDivider>
              Unidade {units[i + 1].order}
            </UnitDivider>
          )}
        </div>
      ))}
    </>
  );
};