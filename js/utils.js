function collision({ playerInfo, blockInfo }) {
  return (
    playerInfo.position.y + playerInfo.height >= blockInfo.position.y &&
    playerInfo.position.y <= blockInfo.position.y + blockInfo.height &&
    playerInfo.position.x <= blockInfo.position.x + blockInfo.width &&
    playerInfo.position.x + playerInfo.width >= blockInfo.position.x
  );
}

function platformCollision({ playerInfo, blockInfo }) {
  return (
    playerInfo.position.y + playerInfo.height >= blockInfo.position.y &&
    playerInfo.position.y + playerInfo.height <=
      blockInfo.position.y + blockInfo.height &&
    playerInfo.position.x <= blockInfo.position.x + blockInfo.width &&
    playerInfo.position.x + playerInfo.width >= blockInfo.position.x
  );
}
