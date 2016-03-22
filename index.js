"use strict";

class ValidationResults {
  constructor(status, msg) {
    this.status = status;
    this.msg = msg;
  }
}

function getLen(str) {
  return (str.length + encodeURI(str).split(/%..|./).length - 1) / 2;
}

function lenValid(value, name) {
  if (value.length == 0)
    return new ValidationResults(false, name + "不能为空");
  if (getLen(value) < 4 || getLen(value) > 16)
    return new ValidationResults(false, name + "长度不合法");
  return new ValidationResults(true, name + "可用");
}

function template(text, regex, success, failed) {
  if (regex.test(text))
    return new ValidationResults(true, success);
  return new ValidationResults(false, failed);
}

const Validators = {
  name: () => lenValid(document.getElementById('name').value, "名字"),
  password: () => lenValid(document.getElementById('password').value, "密码"),
  ["password-re"]() {
    let ret = this.password();
    if (ret.status == false) return new ValidationResults(false, "前面的密码不合法");
    if (document.getElementById('password').value != document.getElementById('password-re').value)
      return new ValidationResults(false, "两次输入的密码不同");
    return new ValidationResults(true, "密码配对");
  },
  email: () => template(document.getElementById('email').value, /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "格式正确", "电子邮件格式错误"),
  phone: () => template(document.getElementById('phone').value, /^1[3|4|5|8][0-9]\d{4,8}$/, "手机格式正确", "手机格式错误")
}

function check(el) {
  const ret = Validators[el]();
  document.getElementById(el).parentElement.className = ret.status ? "box verified" : "box error";
  document.getElementById(el).nextSibling.setAttribute("data-validation", ret.msg);
}

function submit() {
  for (let el in Validators) {
    let ret = Validators[el]();
    if (!ret.status) {
      alert('提交失败');
      return;
    }
  }
  alert('提交成功');
}