const accountId = "near";
const limit = 3;
let posts = [];

const indexedPosts = Social.index("post", "main", {
  accountId,
  limit: 20,
  order: "desc",
});

if (indexedPosts?.length > 0) {
  posts = [];

  indexedPosts.forEach((post) => {
    const data = Social.get(`${post.accountId}/post/main`, post.blockHeight);

    if (data) {
      const json = JSON.parse(data);
      const content = json.text.split("\n");
      const title = content[0] || "";
      const url = content[1] || content[2] || "";
      const lastLine = content.pop() || "";
      const hasNewsTag = lastLine.indexOf("#news") > -1;
      const isValid = hasNewsTag && url.indexOf("https://") > -1;

      if (isValid) {
        posts.push({
          blockHeight: post.blockHeight,
          title,
          url,
        });

        posts.sort((a, b) => b.blockHeight - a.blockHeight);
      }
    }
  });

  posts = posts.slice(0, limit);
}

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
`;

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0;
`;

const Items = styled.ul`
  list-style: disc;
  padding-left: 16px;
  margin: 0;
  color: #687076;
`;

const Item = styled.li`
  width: 100%;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  > * {
    min-width: 0;
  }
`;

const Text = styled.span`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")} !important;
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};

  &[href] {
    &:hover,
    &:focus {
      outline: none;
      text-decoration: underline;
    }
  }
`;

const ButtonLink = styled.a`
  display: block;
  width: 100%;
  padding: 8px;
  height: 32px;
  background: #fbfcfd;
  border: 1px solid #d7dbdf;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: #11181c !important;
  margin: 0;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }
`;

return (
  <Wrapper>
    <H2>News</H2>

    {indexedPosts !== null && posts.length === 0 ? (
      <Text>No recent news at the moment. Check back soon!</Text>
    ) : (
      <Items>
        {posts.map((item, i) => (
          <Item key={i}>
            <Text as="a" href={item.url} target="_blank" bold>
              {item.title}
            </Text>
            <Text small>
              <Widget
                src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}"
                props={{ blockHeight: item.blockHeight }}
              />{" "}
              ago
            </Text>
          </Item>
        ))}
      </Items>
    )}

    <ButtonLink href="https://pages.near.org/blog/" target="_blank">
      View All News
    </ButtonLink>
  </Wrapper>
);
