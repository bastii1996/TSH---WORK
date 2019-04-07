import './assets/scss/app.scss';
import $ from 'cash-dom';
import isomorphicFetch from 'isomorphic-fetch';

export class App {
  initializeApp() {
    let self = this;

    $('.load-username').on('click', function (e) {
      let userName = $('.username.input').val();
      self.removeError();
      self.validateUserName(userName);
    })
  }

  validateUserName(val) {
    const regx = /^[A-Za-z0-9_.-]+$/;
    regx.test(val) ? this.getDate(val) : this.emitError();
  }

  getDate(userName) {
    fetch('https://api.github.com/users/' + userName)
      .then(response => response.json())
      .then(body => {
        this.profile = body;
        this.update_profile();
    })
  }

  emitError() {
    $('.js-search').addClass('error');
  }

  removeError() {
    $('.js-search').removeClass('error');
  }

  update_profile() {
    $('#profile-name').text($('.username.input').val())
    $('#profile-image').attr('src', this.profile.avatar_url)
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login)
    $('#profile-bio').text(this.profile.bio || '(no information)')
  }
}
