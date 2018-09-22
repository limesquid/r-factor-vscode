exports.WARMUP_COUNT = 3;

exports.WARMUP_REFACTORING = 'generate-prop-types';

exports.WARMUP_CODE = `
import React from 'react';
import PropTypes from 'prop-types';
import Section from 'components/section';
import TeamMember from './team-member';
import backgroundImage from './bg.png';
import './styles.scss';

function MeetOurTeam({ members }) {
  return (
    <Section
      className="meet-our-team"
      title="Meet our team"
      background={backgroundImage}>
      <div className="team-members">
        {members.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </Section>
  );
}

export default MeetOurTeam;
`;
