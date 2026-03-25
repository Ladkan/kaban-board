import type { BoardMember } from "../types"
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
        ...members.map(m => {
            client.collection("board_members").create({
                board: board.id,
                user: m,
                role: 'viewer'
            })
        })
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

export const removeMember = async (boardId: string, userId: string) => {
    const member = await client.collection('board_members').getList(1,1,{
        filter: `board = "${boardId}" && user = "${userId}"`,
    })
    await client.collection("board_members").delete(member.items[0].id)

    return member.items[0].id
} 