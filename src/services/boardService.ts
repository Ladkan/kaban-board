import { client } from "./pocketbase"

export const getBoards = async () => {
    return await client.collection('boards').getFullList({
        sort: '-created',
        expand: 'owner,members',
    })
}

export const createBoard = async (title: string, members: string[]) => {
    const board = await client.collection('boards').create({
        title,
        members,
        owner: client.authStore.record?.id,
    })

    await Promise.all([
        client.collection("columns").create({ title: "Todo", order: 1000, board: board.id }),
        client.collection("columns").create({ title: "In Progress", order: 2000, board: board.id }),
        client.collection("columns").create({ title: "Done", order: 3000, board: board.id }),
    ])
    
    return board
}

export const addMember = async (boardId: string, userId: string) => {
    const board = await client.collection('boards').getOne(boardId)
    return client.collection('boards').update(boardId, {
        members: [...board.members, userId],
    })
}

export const deleteBoard = (boardId: string) => client.collection('boards').delete(boardId)