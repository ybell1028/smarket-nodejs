const {check, validationResult} = require('express-validator');
var util = require("../middleware/util");

exports.result = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(422);
        console.dir(err);
        err.errors.name = err.name
        res.json(util.successFalse({ 
            name: 'ValidationError',
            errors : err.errors //에러가 ID에서만 나면 [0], password까지 나면 [1]까지 배열 출력
            })
        );
    }
    else next();
}

exports.user_id = [
    check('user_id') // req.body, req.cookies, req.headers
    // req.params, req.query에 user_id라는 속성이 있는지 검사
        .trim() // 해당 값에 공백이 있으면 없애고 붙힘
        .not() // 만약
        .isEmpty() // 빈값(""빈스트링, null, undefined)이라면
        .withMessage('ID를 입력해주세요.')//패러미터에 들어있는 스트링을 msg에 담아 응답
        .bail()//위의 조건에 해당하면 아래에 있는 유효성 검사는 하지 않음
        .isAlphanumeric() // 영문 || 숫자 || 영문 + 숫자인가?
        .withMessage('영문 또는 숫자를 입력해주세요.')
        .bail()
        .isLength({ min: 6 }) // String의 길이가 6 이상인가?
        .withMessage('ID는 6자리 이상입니다.')
]

exports.password = [
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('비밀번호를 입력해주세요.')
        .bail()
        .isAlphanumeric()
        .withMessage('영문 또는 숫자를 입력해주세요.')
        .bail()
        .isLength({ min: 6 })
        .withMessage('비밀번호는 6자리 이상입니다.') // 비밀번호를 공백으로 내면 이 메시지는 무시
]

exports.name = [ // 한글만 가능하게 추후 구현 필요
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('이름을 입력해주세요.')
        .bail()
        .isAlpha(['ko-KR'])
        .withMessage('이름은 한글로 입력해주세요.')
        .bail()
        .isLength({ min: 2 })
        .withMessage('이름은 2자리 이상입니다.')
]

exports.nickname = [
    check('nickname')
        .trim()
        .not()
        .isEmpty()
        .withMessage('닉네임을 입력해주세요.')
        .bail()
        .isLength({ min: 2 })
        .withMessage('닉네임은 2자리 이상입니다.')
]

exports.phonenum = [
    check('phonenum')
        .trim()
        .not()
        .isEmpty()
        .withMessage('전화번호를 입력해주세요.')
        .bail()
        .isMobilePhone('ko-KR')
        .withMessage('유효하지 않은 전화번호 형식입니다.')
]

exports.folder_name = [
    check('folder_name')
        .not()
        .isEmpty()
        .withMessage('폴더명을 입력해주세요.')
]

exports.item_title = [
    check('item_title')
        .not()
        .isEmpty()
        .withMessage('아이템 타이틀이 필요합니다.')
]

exports.item_id = [
    check('item_id')
        .not()
        .isEmpty()
        .withMessage('아이템 ID가 필요합니다.')
]

exports.item_type = [
    check('item_type')
        .not()
        .isEmpty()
        .withMessage('아이템 타입이 필요합니다.')
        .bail()
        .isInt()
        .withMessage('아이템 타입은 Integer입니다.')
]

exports.item_selling = [
    check('item_selling')
        .not()
        .isEmpty()
        .withMessage('아이템 판매여부가 필요합니다.')
        .bail()
        .isBoolean()
        .withMessage('아이템 판매여부는 Boolean입니다.')
]

exports.before_name = [
    check('before_name')
        .not()
        .isEmpty()
        .withMessage('변경 전 이름을 입력해주세요.')
]

exports.after_name = [
    check('after_name')
        .not()
        .isEmpty()
        .withMessage('변경 후 이름을 입력해주세요.')
]

exports.new_name = [
    check('new_name')
        .not()
        .isEmpty()
        .withMessage('변경 할 이름을 입력해주세요.')
]