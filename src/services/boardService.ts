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

export const updateBoard = async (boardId: string, title: string, members: string[]) => {
    return client.collection('boards').update(boardId, {
        title,
        members,
    })
}

export const deleteBoard = (boardId: string) => client.collection('boards').delete(boardId)