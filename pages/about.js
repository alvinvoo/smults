import React from 'react';// work with components
import Layout from '../components/Layout';

export default () => (
  <Layout item="about">
    <div className="aboutDiv">
      <h2>Intro video</h2>
      <iframe
        title="youtube-intro"
        width="750"
        height="425"
        src="https://www.youtube.com/embed/SWYt4bGmN7w"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
    <div className="aboutDiv">
      <h3>Why smults?</h3>
      <p>
        <a href="https://steemit.com" target="_blank" rel="noopener noreferrer">steemit.com</a>
        {' '}
        allows searches by using only ONE tag, while
        {' '}
        <a href="https://busy.org/" target="_blank" rel="noopener noreferrer">busy.org</a>
        {' '}
        searches by single user&apos;s name,
        this is inconvenient for those who need to look for more specific posts.
        Smults is here to address this issue!
      </p>
      <h3>Can I add custom tags in the search bar?</h3>
      <p>Sure! Just start typing and press &apos;Enter&apos; to include the tag(s) when you are done!</p>
      <h3>Can I search by &lsquo;Author&rsquo;?</h3>
      <p>Of course! Just switch the &lsquo;Filter tags by..&rsquo; filter to &lsquo;Author&rsquo;, an input box will appear to the right where you can start typing and look for your favorite author! (Much like busy.org&apos;s search bar)</p>
      <p>You can also further filter his or her posts down by searching with tags!</p>
      <h3>Why &apos;15&apos; trending tags to start with? Why not &apos;18&apos; or &apos;23&apos;?</h3>
      <p>Well.. That&apos;s just my personal preference ;). You can add more custom search tags by youself!</p>
      <h3>What is this &apos;Mark first tag as category&apos; checkbox thing?</h3>
      <p>When you mark it and search, the return results will have their categories as the first tag you are searching for. Isn&apos;t that just convenient? ;)</p>
      <h3>I spotted a nasty error/bug.. Where can I report it?</h3>
      <p>
        Head over to this project&apos;s
        {' '}
        <a href="https://github.com/Alvin-Voo/smults" target="_blank" rel="noopener noreferrer">github page</a>
        {' '}
        and log an issue.
      </p>
      <h3>I have a great idea for your application! I want to contribute!</h3>
      <p>
        Great! Let me know at
        {' '}
        <a href="https://steemit.com/@alvinvoo" target="_blank" rel="noopener noreferrer">@alvinvoo</a>
        , comment on my post which announces this project, hit me up in discord (alvinvoo#3009) or you can visit this project&apos;s
        {' '}
        <a href="https://github.com/Alvin-Voo/smults" target="_blank" rel="noopener noreferrer">github page</a>
        {' '}
        and log a &lsquo;Feature request&rsquo; under the issue page.
      </p>
      <h3>Is this free?</h3>
      <p>Of course! I will let you know when it&apos;s not. ;)</p>
    </div>
  </Layout>
);
