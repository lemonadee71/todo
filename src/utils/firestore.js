import Core from '../core';

export const path = (type) => `${Core.state.currentUser}/${type}/items`;
