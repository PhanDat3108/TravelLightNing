
const buildCategoryTree = (categories, parentId = "") => {
    const tree = [];
    categories.forEach(element => {

        if (element.parent == parentId) {
            const children = buildCategoryTree(categories, element.id)

            tree.push({
                id: element.id,
                name: element.name,
                children: children
            })
        }

    });
    return tree;
}
module.exports.buildCategoryTree = buildCategoryTree;