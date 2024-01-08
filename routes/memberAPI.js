// 회원 정보관리 RESTful API 전용 라우팅
// http://localhost:3000/api/member

var express = require('express');
var router = express.Router();

var Member = require('../schemas/member')
const bcrypt = require('bcrypt');


// Get all members
router.get('/all', async(req, res)=>{
    try {
        var members = await Member.find();
        res.json(members);
    }catch(error) {
        console.log(error);
        res.json({ message: "Member not find", error: error });
    }
});


router.post('/login', async (req, res, next) => {

    var loginData = {
        email: req.body.email,
        member_password: req.body.password
    };

    try {
        var user = await Member.findOne({
            email: loginData.email
        });

        if (!user) {
            return res.json({ message: "이메일이나 비밀번호가 올바르지 않습니다." });
        }

        // 비밀번호 비교
        const passwordVal = await bcrypt.compare(loginData.member_password, user.member_password);

        if (passwordVal) {
            // 로그인 성공
            res.json({ message: "로그인 성공", user: user });
        } else {
            // 비밀번호 불일치
            res.json({ message: "이메일이나 비밀번호가 올바르지 않습니다." });
        }

    } catch (error) {
        console.log(error);
        res.json({ message: "로그인에 실패하였습니다.", error: error });
    }
});

// Create a new member
router.post('/entry', async(req, res)=>{

    var memberData = {
        email: req.body.email,
        member_password: req.body.password,
        name: req.body.name,
        telephone: req.body.telephone,
        entry_type_code: 1,
        use_state_code: 1,
        profile_img_path: req.body.profileImgPath,
        birth_date: req.body.birthDate,
        reg_date: Date.now(),
        reg_member_id: 1,
        edit_date: Date.now()
    };

    try {
        var regEmail = await Member.findOne({email:memberData.email});

        if(!regEmail) {
            // 이미 가입된 이메일이 없으면 회원가입 진행
            await Member.create(memberData);
            console.log('회원가입완료');
            res.json({ message: "member created" });
        } else {
            console.log('이미 가입된 메일입니다.');
        }

    }catch(error) {
        console.log(error);
        res.json({ message: "Member not create", error: error });
    }
});

// Modify an existing member
router.post('/modify', async (req, res) => {

    const member_id = req.body.member_id;

    var memberData = {
        email: req.body.email,
        member_password: req.body.password,
        name: req.body.name,
        telephone: req.body.telephone,
        birth_date: req.body.birthDate,
        edit_date: Date.now(),
        edit_member_id: 1
    };

    var member = {member_id: member_id}
    
    try {
        var result = await Member.updateOne(memberData, member);
        console.log(result, '수정완료');

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Member not updated", error: error });
    }
});


// Delete a member
router.post('/delete', async(req, res) =>{

    const memberId = req.body.member_id;


    res.json({ message: "member deleted" });
});

// Get a single member by ID
// router.get('/:mid', async(req, res) =>{
//     var memberId = parseInt(req.params.mid, 10); // 10진수 정수로 변환

//     var members = await getMembersData();
//     var member = members.find(m => m.member_id === memberId);

//     res.json({ member});
// });

module.exports = router;