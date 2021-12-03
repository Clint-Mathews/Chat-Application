var request = require('request');
// Dummy test
describe('calc',()=>{
    it('should multiply 2 and 2',()=>{
        expect(mult(2,2)).toBe(4);
    })
});
function mult(x,y) {
    return x*y;
}

describe('get messages',()=>{
    it('should get 200 response',(done)=>{
        request.get('http://localhost:3000/messages',(err,res)=>{
            // console.log(res.body);
            expect(res.statusCode).toEqual(200);
            done();
        });
    });
    it('returns a list that is not empty',(done)=>{
        request.get('http://localhost:3000/messages',(err,res)=>{
            // console.log(res.body);
            expect(JSON.parse(res.body).length).toBeGreaterThan(0);
            done();
        });
    });
});

describe('GET API based on name',()=>{
    it('should get 200 response',(done)=>{
        request.get('http://localhost:3000/messages/tim',(err,res)=>{
            expect(res.statusCode).toEqual(200);
            done();
        });
    });
    it('Name needs to be as user passed',(done)=>{
        request.get('http://localhost:3000/messages/tim',(err,res)=>{
            // console.log(JSON.parse(res.body)[0]);
            expect(JSON.parse(res.body)[0].name).toEqual('tim');
            done();
        });
    })
});