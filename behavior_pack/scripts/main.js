const system = server.registerSystem(0, 0);

const CONFIG = {
  STARTING_AGE: 18,
  SATURATION_TICK_INTERVAL_SECONDS: 30,
  SATURATION_EFFECT_DURATION_SECONDS: 6,
  SATURATION_LEVEL: 1,
  ENABLE_PERIODIC_HUNGER: false,
  HUNGER_TICK_INTERVAL_SECONDS: 60,
  HUNGER_EFFECT_LEVEL: 0,
  WET_CEMENT_HARDEN_TICKS: 20,
  WINDMILL_POWER_OUTPUT: 1
};

let saturationTickCount = 0;
let hungerTickCount = 0;

system.initialize = function () {
  this.listenForEvent("minecraft:block_placed", (eventData) => this.onBlockPlaced(eventData));
  this.listenForEvent("minecraft:entity_created", (eventData) => this.onEntityCreated(eventData));
  this.listenForEvent("minecraft:script_tick", () => this.onTick());
  this.executeCommand("scoreboard objectives add btw_age dummy", () => {});
  // create a dummy scoreboard for windmill power tracking (prototype)
  this.executeCommand("scoreboard objectives add btw_power dummy", () => {});
};

system.onBlockPlaced = function (eventData) {
  try {
    const blockPos = eventData.data.block_position;
    const blockIdentifier = eventData.data.block_identifier || eventData.data.block?.name;

    if (!blockIdentifier) return;

    if (blockIdentifier === "btw:cement_block" || blockIdentifier === "btw:cement_item") {
      const x = blockPos.x;
      const y = blockPos.y;
      const z = blockPos.z;

      this.executeCommand(`/setblock ${x} ${y} ${z} btw:wet_cement`, () => {});
      this.schedule(() => {
        this.executeCommand(`/setblock ${x} ${y} ${z} btw:cement_block`, () => {});
      }, CONFIG.WET_CEMENT_HARDEN_TICKS);
    }

    // If player places a windmill, mark a nearby dummy power value (prototype behavior)
    if (blockIdentifier === "btw:windmill") {
      // increment global power counter (stored as scoreboard) — prototype only
      this.executeCommand(`scoreboard players add Global btw_power ${CONFIG.WINDMILL_POWER_OUTPUT}`, () => {});
    }
  } catch (e) {
    // prototype-safe error handling
  }
};

system.onEntityCreated = function (eventData) {
  const entity = eventData.data.entity;
  if (!entity) return;

  const type = entity.__identifier__ || entity.type;
  const isPlayer = type === "minecraft:player" || type === "player";

  if (isPlayer) {
    const name = entity.name;

    if (name) {
      this.executeCommand(`scoreboard players set \"${name}\" btw_age ${CONFIG.STARTING_AGE}`, () => {});
    } else {
      this.executeCommand(`scoreboard players set @a btw_age ${CONFIG.STARTING_AGE}`, () => {});
    }

    this.executeCommand(
      `effect give @a saturation ${CONFIG.SATURATION_EFFECT_DURATION_SECONDS} ${CONFIG.SATURATION_LEVEL} true`,
      () => {}
    );
  }
};

system.onTick = function () {
  saturationTickCount++;
  const satTicksInterval = CONFIG.SATURATION_TICK_INTERVAL_SECONDS * 20;

  if (saturationTickCount >= satTicksInterval) {
    saturationTickCount = 0;
    this.executeCommand(
      `effect give @a saturation ${CONFIG.SATURATION_EFFECT_DURATION_SECONDS} ${CONFIG.SATURATION_LEVEL} true`,
      () => {}
    );
  }

  if (CONFIG.ENABLE_PERIODIC_HUNGER) {
    hungerTickCount++;
    const hungerTicksInterval = CONFIG.HUNGER_TICK_INTERVAL_SECONDS * 20;

    if (hungerTickCount >= hungerTicksInterval) {
      hungerTickCount = 0;
      this.executeCommand(
        `effect give @a hunger 5 ${CONFIG.HUNGER_EFFECT_LEVEL} true`,
        () => {}
      );
    }
  }
};

system.schedule = function (fn, ticks) {
  let count = 0;

  const tickCallback = () => {
    count++;
    if (count >= ticks) {
      fn();
      return;
    }
    this.listenForEvent("minecraft:script_tick", tickCallback);
  };

  this.listenForEvent("minecraft:script_tick", tickCallback);
};
