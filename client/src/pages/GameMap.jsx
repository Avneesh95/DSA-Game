import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import DoorCard from '../components/DoorCard';
import XPBar from '../components/XPBar';
import { doorApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';

export default function GameMap() {
  const [doors, setDoors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;
    const fetchDoors = async () => {
      try {
        const { data } = await doorApi.getAll();
        if (isMounted) setDoors(data.doors);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load the dungeon map');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDoors();
    return () => {
      isMounted = false;
    };
  }, []);

  // Group doors by world, preserving world progression order (not insertion order)
  const worldSections = useMemo(() => {
    const byWorld = new Map();
    for (const door of doors) {
      const key = door.world || 'Unassigned';
      if (!byWorld.has(key)) byWorld.set(key, { world: key, worldOrder: door.worldOrder ?? 999, doors: [] });
      byWorld.get(key).doors.push(door);
    }
    return [...byWorld.values()].sort((a, b) => a.worldOrder - b.worldOrder);
  }, [doors]);

  const totalCompleted = doors.filter((d) => d.status === 'COMPLETED').length;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-display text-xl sm:text-2xl text-glow-gold mb-1 drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]">
          DSA 100 DOORS
        </h1>
        <p className="text-slate-400 text-sm mb-4">
          Solve each problem, collect the Keys, and unlock the door ahead.
        </p>
        {user && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="max-w-sm w-full sm:w-64">
              <XPBar xp={user.xp} level={user.level} />
            </div>
            {doors.length > 0 && (
              <div className="text-xs sm:text-sm text-slate-400">
                <span className="text-glow-emerald font-semibold">{totalCompleted}</span> / {doors.length} doors
                cleared
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && <p className="text-slate-400">Loading the dungeon...</p>}
      {error && <p className="text-glow-rose">{error}</p>}

      {!isLoading && !error && worldSections.length === 0 && (
        <div className="door-panel text-center py-10">
          <p className="text-slate-300">
            No doors found yet. Run the seed script on the server (<code>npm run seed</code>) to populate the
            dungeon.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {worldSections.map(({ world, doors: worldDoors }) => {
          const completedInWorld = worldDoors.filter((d) => d.status === 'COMPLETED').length;
          return (
            <motion.section
              key={world}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-display text-base sm:text-lg text-glow-purple">{world}</h2>
                <span className="text-xs text-slate-500 shrink-0">
                  {completedInWorld}/{worldDoors.length}
                </span>
              </div>
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
                {worldDoors
                  .sort((a, b) => a.doorNumber - b.doorNumber)
                  .map((door) => (
                    <DoorCard key={door.doorNumber} door={door} />
                  ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </MainLayout>
  );
}
