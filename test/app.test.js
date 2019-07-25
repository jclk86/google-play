const chai = require("chai"),
    expect = chai.expect; 
chai.use(require("chai-sorted"));
const request = require("supertest")
const app = require("../app")
const games = require("../games")

describe("app module", () => {
    it("should sort by title", () => {
        return request(app)
        .get("/apps")
        .query({sort: "App"})
        .expect(200)
        .expect("Content-Type", /json/)
        .then(res => {
            let i = 0;
            let sorted = true;
            while(sorted && i < res.body.length - 1) {
                sorted = sorted && res.body[i].App < res.body[i + 1].App;
                i++;
            }
            expect(sorted).to.be.true;
        })
    })

    it("should sort by rating", () => {
        return request(app)
        .get("/apps")
        .query({sort: "Rating"})
        .expect(200)
        .expect("Content-Type", /json/)
        .then(res => {
            let i = 0;
            let sorted = true;
            while(sorted && i < res.body.length - 1) {
                sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating; //if preceding value is more than following value
                i++;
            }
            expect(sorted).to.be.true;
        })
    })

    it("should filter by genres", () => {
        return request(app)
        .get("/apps")
        .query({genres: "Action"})
        .expect(200)
        .expect("Content-Type", /json/)
        .then(res => {
            let i = 0;
            let filtered = true;
            while(filtered && i < res.body.length) {
                filtered = filtered && res.body[i].Genres.includes("Action")
                i++
            }
            expect(filtered).to.be.true
        })
    })

    it("if no sort or genre query, returns all games", () => {
        return request(app)
        .get("/apps")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(res => {
            expect(res.body.includes(games))
        })
    })

    it("returns 400 if sort is not a valid entry", () => {
      return request(app)
      .get("/apps")
      .query({sort: 4})
      .expect(400, "Must be one of rating or app")
    })

    it("returns 400 if genres is not a valid entry", () => {
      return request(app)
      .get("/apps")
      .query({genres: "goo"})
      .expect(400, "Must be one of action, puzzle, strategy, casual, arcade, card")
    })
})