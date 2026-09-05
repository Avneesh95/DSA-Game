const Door = require('../models/Door');
const UserProgress = require('../models/UserProgress');

// @desc    Get the full 100-door game map, annotated with this user's
//          per-door status (LOCKED / AVAILABLE / IN_PROGRESS / COMPLETED)
// @route   GET /api/doors
// @access  Private
const getDoors = async (req, res, next) => {
  try {
    const doors = await Door.find()
      .populate('problem', 'title topic pattern difficulty xp doorNumber')
      .sort({ doorNumber: 1 });

    const progressRecords = await UserProgress.find({ userId: req.user._id });
    const progressByDoor = new Map(progressRecords.map((p) => [p.doorNumber, p]));

    const completedSet = new Set(req.user.completedDoors);

    const map = doors.map((door) => {
      const progress = progressByDoor.get(door.doorNumber);

      let status = 'LOCKED';
      if (door.isLockedByAdmin) {
        status = 'LOCKED';
      } else if (completedSet.has(door.doorNumber)) {
        status = 'COMPLETED';
      } else if (progress?.status === 'IN_PROGRESS') {
        status = 'IN_PROGRESS';
      } else {
        // Door 1 is always available; otherwise requires previous door completed
        const prereq = door.requiresDoorNumber ?? door.doorNumber - 1;
        if (prereq === 0 || completedSet.has(prereq)) {
          status = 'AVAILABLE';
        }
      }

      return {
        doorNumber: door.doorNumber,
        world: door.world,
        worldOrder: door.worldOrder,
        isBossDoor: door.isBossDoor,
        title: door.problem?.title,
        topic: door.problem?.topic,
        pattern: door.problem?.pattern,
        difficulty: door.problem?.difficulty,
        xp: door.problem?.xp,
        status,
      };
    });

    res.json({ success: true, doors: map });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single door's metadata + this user's progress on it
// @route   GET /api/doors/:doorNumber
// @access  Private
const getDoorByNumber = async (req, res, next) => {
  try {
    const doorNumber = Number(req.params.doorNumber);
    if (!Number.isInteger(doorNumber) || doorNumber < 1 || doorNumber > 100) {
      return res.status(400).json({ success: false, message: 'Invalid door number' });
    }

    const door = await Door.findOne({ doorNumber }).populate('problem');
    if (!door) {
      return res.status(404).json({ success: false, message: 'Door not found' });
    }

    const completedSet = new Set(req.user.completedDoors);
    const prereq = door.requiresDoorNumber ?? door.doorNumber - 1;
    const isUnlocked = !door.isLockedByAdmin && (prereq === 0 || completedSet.has(prereq));

    if (!isUnlocked && !completedSet.has(doorNumber)) {
      return res.status(403).json({
        success: false,
        message: `Door ${doorNumber} is locked. Complete Door ${prereq} first.`,
      });
    }

    let progress = await UserProgress.findOne({ userId: req.user._id, doorNumber });
    if (!progress) {
      progress = await UserProgress.create({
        userId: req.user._id,
        doorNumber,
        problemId: door.problem._id,
        totalKeys: door.problem.keys.length,
        status: 'AVAILABLE',
      });
    }

    // Never send hidden key expected outputs / inputs to the client
    const safeProblem = door.problem.toObject();
    safeProblem.keys = safeProblem.keys.map((key) => {
      if (key.isHidden) {
        return { _id: key._id, type: key.type, isHidden: true, difficulty: key.difficulty };
      }
      return key;
    });
    delete safeProblem.referenceSolution;

    res.json({
      success: true,
      door: {
        doorNumber: door.doorNumber,
        world: door.world,
        isBossDoor: door.isBossDoor,
      },
      problem: safeProblem,
      progress,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDoors, getDoorByNumber };
