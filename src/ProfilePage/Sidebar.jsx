State.init({
  copiedShareUrl: false,
  hasBeenFlagged: false,
});

const accountId = props.accountId;
const profile =
  props.profile || Social.get(`${accountId}/profile/**`, "final") || {};
const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

if (!accountId) {
  return "";
}

// Profile Data:
const tags = Object.keys(profile.tags || {});
const viewingOwnAccount = accountId === context.accountId;
const accountUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const shareUrl = `https://${REPL_NEAR_URL}${accountUrl}`;

// Follower Count:
const following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
const followers = Social.keys(`*/graph/follow/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
const followingCount = following
  ? Object.keys(following[accountId].graph.follow || {}).length
  : null;
const followersCount = followers ? Object.keys(followers || {}).length : null;

// Account follows you:
const accountFollowsYouData = Social.keys(
  `${accountId}/graph/follow/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);
const accountFollowsYou = Object.keys(accountFollowsYouData || {}).length > 0;

const contentModerationItem = {
  type: "social",
  path: profileUrl,
  reportedBy: context.accountId,
};

const Wrapper = styled.div`
  display: grid;
  gap: 40px;
  position: relative;

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    height: 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    background: #fbfcfd;
    border: 1px solid #d7dbdf;
    color: #11181c !important;

    &.button--primary {
      width: 100%;
      color: #006adc !important;

      @media (max-width: 1024px) {
        width: auto;
      }
    }

    &:hover,
    &:focus {
      background: #ecedee;
      text-decoration: none;
      outline: none;
    }

    i {
      color: #7e868c;
    }

    .bi-16 {
      font-size: 16px;
    }
  }

  @media (max-width: 900px) {
    gap: 24px;
  }
`;

const Section = styled.div`
  display: grid;
  gap: 24px;
`;

const Avatar = styled.div`
  width: 133px;
  height: 133px;
  flex-shrink: 0;
  border: 3px solid #fff;
  overflow: hidden;
  border-radius: 100%;
  box-shadow: 0px 12px 16px rgba(16, 24, 40, 0.08),
    0px 4px 6px rgba(16, 24, 40, 0.03);

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 900px) {
    width: 80px;
    height: 80px;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: ${(p) => p.size || "25px"};
  line-height: 1.2em;
  color: #11181c;
  margin: ${(p) => (p.margin ? "0 0 24px" : "0")};
  overflow-wrap: anywhere;
`;

const Text = styled.p`
  margin: 0;
  line-height: 1.5rem;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};
  overflow-wrap: anywhere;

  b {
    font-weight: 600;
    color: #11181c;
  }

  &[href] {
    display: inline-flex;
    gap: 0.25rem;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #11181c !important;
  font-weight: 400;
  font-size: 14px;
  white-space: nowrap;
  outline: none;
  overflow-x: hidden;
  text-overflow: ellipsis;

  &:focus,
  &:hover {
    text-decoration: underline;
  }

  i {
    color: #7e868c;
    margin-right: 8px;
  }
`;

const TextBadge = styled.p`
  display: inline-block;
  margin: 0;
  font-size: 10px;
  line-height: 1.1rem;
  background: #687076;
  color: #fff;
  font-weight: 600;
  white-space: nowrap;
  padding: 0 6px;
  border-radius: 3px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
`;

const SocialLinks = styled.div`
  display: grid;
  gap: 9px;
`;

const FollowButtonWrapper = styled.div`
  flex: 1 0 auto;
  div,
  button {
    width: 100%;
  }
  @media (max-width: 1024px) {
    flex: 0 0 auto;
    div,
    button {
      width: auto;
    }
  }
`;

return (
  <Wrapper>
    <Avatar>
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: profile.image,
          alt: profile.name,
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
        }}
      />
    </Avatar>

    <Section>
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <Title>{profile.name || accountId}</Title>
          <Text>@{accountId}</Text>

          {accountFollowsYou && <TextBadge>Follows You</TextBadge>}
        </div>
        {accountId !== context.accountId && (
          <Widget
            src={`${REPL_ACCOUNT}/widget/DIG.Toast`}
            props={{
              type: "info",
              title: "Flagged for moderation",
              description:
                "Thanks for helping our Content Moderators. The item you flagged will be reviewed.",
              open: state.hasBeenFlagged,
              onOpenChange: () => {
                State.update({ hasBeenFlagged: false });
              },
              duration: 5000,
              trigger: (
                <div className="d-inline-block ms-auto">
                  <Widget
                    src="${REPL_ACCOUNT}/widget/FlagButton"
                    props={{
                      item: contentModerationItem,
                      onFlag: () => {
                        State.update({ hasBeenFlagged: true });
                      },
                    }}
                  />
                </div>
              ),
            }}
          />
        )}
      </div>

      <Actions>
        {viewingOwnAccount ? (
          <a
            className="button button--primary"
            href="#/${REPL_ACCOUNT}/widget/ProfileEditor"
          >
            <i className="bi bi-pencil"></i>
            Edit Profile
          </a>
        ) : context.accountId ? (
          <>
            <FollowButtonWrapper>
              <Widget
                src="${REPL_ACCOUNT}/widget/FollowButton"
                props={{
                  accountId,
                }}
              />
            </FollowButtonWrapper>

            <Widget
              src="${REPL_ACCOUNT}/widget/PokeButton"
              props={{
                accountId,
              }}
            />
          </>
        ) : (
          <></>
        )}

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
        >
          <button
            className="button"
            type="button"
            onMouseLeave={() => {
              State.update({ copiedShareUrl: false });
            }}
            onClick={() => {
              clipboard.writeText(shareUrl).then(() => {
                State.update({ copiedShareUrl: true });
              });
            }}
          >
            {state.copiedShareUrl ? (
              <i className="bi-16 bi bi-check"></i>
            ) : (
              <i className="bi-16 bi-link-45deg"></i>
            )}
            Share
          </button>
        </OverlayTrigger>
      </Actions>
    </Section>

    {tags.length > 0 && (
      <Section>
        <Widget
          src="${REPL_ACCOUNT}/widget/Tags"
          props={{
            tags,
          }}
        />
      </Section>
    )}

    <Section>
      <Stats>
        <Text as="a" href={`${accountUrl}&tab=following`}>
          <b bold as="span">
            {followingCount === null ? "--" : followingCount}
          </b>{" "}
          Following
        </Text>
        <Text as="a" href={`${accountUrl}&tab=followers`}>
          <b>{followersCount === null ? "--" : followersCount}</b> Followers
        </Text>
      </Stats>
    </Section>

    {profile.linktree && (
      <Section>
        <SocialLinks>
          {profile.linktree.website && (
            <TextLink
              href={`https://${profile.linktree.website}`}
              target="_blank"
            >
              <i className="bi bi-globe"></i> {profile.linktree.website}
            </TextLink>
          )}

          {profile.linktree.github && (
            <TextLink
              href={`https://github.com/${profile.linktree.github}`}
              target="_blank"
            >
              <i className="bi bi-github"></i> {profile.linktree.github}
            </TextLink>
          )}

          {profile.linktree.twitter && (
            <TextLink
              href={`https://twitter.com/${profile.linktree.twitter}`}
              target="_blank"
            >
              <i className="bi bi-twitter"></i> {profile.linktree.twitter}
            </TextLink>
          )}

          {profile.linktree.telegram && (
            <TextLink
              href={`https://t.me/${profile.linktree.telegram}`}
              target="_blank"
            >
              <i className="bi bi-telegram"></i> {profile.linktree.telegram}
            </TextLink>
          )}
        </SocialLinks>
      </Section>
    )}
  </Wrapper>
);
