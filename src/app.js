import './assets/scss/app.scss';
import $ from 'cash-dom';
import isomorphicFetch from 'isomorphic-fetch';


export class App {
  initializeApp() {
    let self = this;

    this.profileContainer = document.querySelector('.js-profile');
    this.historyContainer = document.querySelector('.js-history');
    this.timeline = document.querySelector('.js-timeline');
    this.profile = null;
    this.history = null;
    this.historyArr = [];

    $('.load-username').on('click', function (e) {
      let userName = $('.username.input').val();
      self.removeError();
      self.validateUserName(userName);
    })
  }

  validateUserName(val) {
    const regx = /^[A-Za-z0-9_.-]+$/;
    regx.test(val) ? this.getData(val) : this.emitError();
  }

  getData(userName) {
    fetch('https://api.github.com/users/' + userName)
      .then(response => response.json())
      .then(body => {
        this.profile = body;
        this.update_profile();
        this.getHistory(userName);
    })
  }

  getHistory(user) {
    fetch(`https://api.github.com/users/${user}/events/public`)
      .then(resp => resp.json())
      .then(resp => {
        this.history = resp;
        this.filterHistory();
      })
  }

  filterHistory() {
    this.historyArr = this.history.filter(move => {
      return move.type === 'PullRequestEvent' || move.type === 'PullRequestReviewCommentEvent';
    })

    this.buildHistoryHTML();
  }

  buildHistoryHTML() {
    let returnHTML = '';
    this.historyArr.map(point => {
      returnHTML += `
        <div class="timeline-item js-timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="heading">${point.created_at}</p>
            <div class="content">
              <span class="gh-username">
                <img src="${point.actor.avatar_url}"/>
                <a href="${point.actor.url}">${point.actor.display_login}</a>
              </span>
              ${point.payload.action}
              <a href="${point.payload.pull_request.url}">
                ${point.type === 'PullRequestEvent' ? 'Pull request' : 'Review comment'}
              </a>
              <p class="repo-name">
                <a href="${point.repo.url}">${point.repo.name}</a>
              </p>
            </div>
          </div>
        </div>
      `
    });

    this.timeline.innerHTML = returnHTML;
    this.showTimeline();
  }

  emitError() {
    $('.js-search').addClass('error');
  }

  removeError() {
    $('.js-search').removeClass('error');
  }

  showProfile() {
    this.profileContainer.classList.add('active');
  }

  showTimeline() {
    this.historyContainer.classList.add('active');
  }

 
  update_profile() {
    $('#profile-name').text($('.username.input').val())
    $('#profile-image').attr('src', this.profile.avatar_url)
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login)
    $('#profile-bio').text(this.profile.bio || '(no information)')
    setTimeout(() => {
      this.showProfile();
    }, 100)
  }
  
}
