import fetch from 'isomorphic-fetch';
import * as DB from './Database';
import sampleData from './SampleData';
import {
  HN_API_URL,
} from '../config';

// https://github.com/HackerNews/API

function seedTopStories() {
  // Top stories = front page
  fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.json())
    .then((data) => {
      // Replace sample data with live data
      sampleData.hot = data;

      data.forEach(postId =>
        fetch(`${HN_API_URL}/item/${postId}.json`)
          .then(response => response.json())
          .then(post => DB.createNewsItem({
            id: post.id,
            creationTime: post.time * 1000,
            commentCount: post.descendants || 0,
            points: post.score,
            submitterId: post.by,
            title: post.title,
            url: post.url,
          })),
      );
    });
}

function seedNewStories() {
  // New stories = newest
  fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
    .then(response => response.json())
    .then((data) => {
      // Replace sample data with live data
      sampleData.new = data;

      data.forEach(postId =>
        fetch(`${HN_API_URL}/item/${postId}.json`)
          .then(response => response.json())
          .then(post => DB.createNewsItem({
            id: post.id,
            creationTime: post.time * 1000,
            commentCount: post.descendants || 0,
            points: post.score,
            submitterId: post.by,
            title: post.title,
            url: post.url,
          })),
      );
    });
}

/* Seed Data from HN API */
export default function seed() {
  setInterval(seedTopStories, 300000);
  setInterval(seedNewStories, 75000);
}