import request from "supertest";
import server from "../server";

describe('GET /api', () => {
    it('should send back a json response', async () => {
        const res = await request(server).get('/api')

        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch('application/json')
        expect(res.body.msg).toBe('From API')

        expect(res.status).not.toBe(404)
        expect(res.body.msg).not.toBe('from api')
    })
})