function getChildNode(node, childNodeId) {
  return node.children.find((c) => c.id === childNodeId);
}

function increaseChildNodeCount(treeNode, card, board) {
  const childNodeId = card.task_type_details.id;
  let childNode = getChildNode(treeNode, childNodeId);

  if (!childNode) {
    childNode = {
      id: childNodeId,
      count: 0,
      children: [],
      cards: [],
      boards: [],
    };
    treeNode.children.push(childNode);
  }

  childNode.count++;
  childNode.cards.push(card);
  childNode.boards.push(board);

  return childNode;
}

export function buildTree(cleanedData) {
  const newTree = {
    id: 0,
    count: cleanedData.length,
    children: [],
    cards: [],
    boards: [],
  };

  for (const board of cleanedData) {
    let currentNode2 = newTree;

    for (const card of board.cards) {
      currentNode2 = increaseChildNodeCount(currentNode2, card, board);
    }
  }

  return newTree;
}
