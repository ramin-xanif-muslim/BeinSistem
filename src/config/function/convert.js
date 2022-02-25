export function convert(array) {
  var map = {};
  for (var i = 0; i < array.length; i++) {
    var obj = array[i];
    if (!(obj.id in map)) {
      map[obj.id] = obj;
      map[obj.id].children = [];
    }

    if (typeof map[obj.id].name == "undefined") {
      map[obj.id].id = obj.id;
      map[obj.id].name = obj.name;
      map[obj.id].parent = obj.parent;
      map[obj.id].value = obj.value;
      map[obj.id].label = obj.label;
    }

    var parent = obj.parent || "-";
    if (!(parent in map)) {
      map[parent] = {};
      map[parent].children = [];
    }

    map[parent].children.push(map[obj.id]);
  }
  return map["-"];
}
export const convertDataToTree = (obj) => {
    let pid;
    var datas = [];
    Object.values(obj).map((d) => {
      d.ParentId === "00000000-0000-0000-0000-000000000000"
        ? (pid = "")
        : (pid = d.ParentId);
      datas.push({
        id: d.Id,
        name: d.Name,
        parent: pid,
        title: d.Name,
        key: d.Id,
      });
    });
    return convert(datas)
}
export const convertCamelCaseTextToText = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult =
        result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult
}
