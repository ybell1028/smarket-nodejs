const {check, validationResult} = require('express-validator');
var util = require("../middleware/util");

exports.result = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(422);
        res.json(util.successFalse({ 
            name: 'ValidationError',
            errors : err.errors //에러가 ID에서만 나면 [0], password까지 나면 [1]까지 배열 출력
            })
        );
    }
    else next();
}

exports.user_id = [
    check('user_id')
        .trim()
        .not()
        .isEmpty()
        .withMessage('ID를 입력해주세요.')
        .bail()
        .isAlphanumeric()
        .withMessage('영문 또는 숫자를 입력해주세요.')
        .bail()
        .isLength({ min: 6 })
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

exports.name = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('이름을 입력해주세요.')
        .bail()
        .isAlpha()
        .withMessage('유효하지 않은 문자 형식입니다.')
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
        .isAlphanumeric()
        .withMessage('유효하지 않은 문자 형식입니다.')
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

exports.bookmark_name = [
    check('bookmark_name')
        .not()
        .isEmpty()
        .withMessage('북마크명을 입력해주세요.')
]

exports.url = [
    check('url')
        .trim()
        .not()
        .isEmpty()
        .withMessage('URL을 입력해주세요.')
        .bail()
        .isURL()
        .withMessage('유효하지 않은 URL 형식입니다.')
]

exports.before = [
    check('before_name')
        .not()
        .isEmpty()
        .withMessage('변경 전 이름을 입력해주세요.')
        .bail()
]

exports.after = [
    check('after_name')
        .not()
        .isEmpty()
        .withMessage('변경 후 이름을 입력해주세요.')
        .bail()
]