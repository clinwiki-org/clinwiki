import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

interface ProfilePictureProps {
  pictureUrl: string | null;
}

class ProfilePicture extends React.Component<ProfilePictureProps> {
  render() {
    if (this.props.pictureUrl) {
      return (
        <img
          style={{
            borderRadius: '50%',
            margin: '1em',
            display: 'flex',
            maxWidth: '5em',
          }}
          src={this.props.pictureUrl}
          alt="profile-picture"
        />
      );
    } else {
      return (
        <FontAwesome
          className="fa-user"
          name=" fa-user"
          style={{
            display: 'flex',
            maxWidth: '5em',
            margin: '0.2em',
            fontSize: '5em',
          }}
        />
      );
    }
  }
}

export default ProfilePicture;
