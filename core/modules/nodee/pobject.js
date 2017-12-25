export default {
  deleteKeys(obj, deletes) {
    deletes = deletes || [];

    deletes.forEach(value => {
      let level = obj;

      let parts = value.split('.');

      for (let i = 0; i < parts.length - 1; i++) {
        level = level[parts[i]];
      }

      level[parts[parts.length - 1]] = undefined;
    });
  },

  selectKeys(obj, selects) {
    let newObj = {};
    selects = selects || [];

    selects.forEach(value => {
      let level = newObj;
      let orgLevel = obj;

      let parts = value.split('.');

      for (let i = 0; i < parts.length - 1; i++) {
        if (i < parts.length - 2) {
          if (level[parts[i]] == undefined) {
            level[parts[i]] = [];
          }
        }

        level = level[parts[i]];
        orgLevel = orgLevel[parts[i]];
      }

      level[parts[parts.length - 1]] = orgLevel[parts[parts.length - 1]];
    });

    return newObj;
  },

  path(obj, path) {
    let parts = path.split('.');

    let levelValue = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      try {
        levelValue = levelValue[parts[i]];
        
        if (typeof levelValue === undefined) {
          return null;
        }
      } catch (e) {
        return null;
      }
    }

    return levelValue;
  }
};
