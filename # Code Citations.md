# Code Citations

## License: unknown
https://github.com/memochou1993/next-auth-example/tree/f4ce59c3dc1c099274c0ad5c992ed2a4234c3434/app/api/auth/%5B...nextauth%5D/route.js

```
({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
```


## License: unknown
https://github.com/memochou1993/blog/tree/38ea0079b09d7cb1a5d3bd76ae0816604b8991a6/source/_posts/2023/08/2023-08-21-%E5%9C%A8-Next-13-0-%E4%BD%BF%E7%94%A8-NextAuth-js-%E8%AA%8D%E8%AD%89%E5%A5%97%E4%BB%B6.md

```
, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler
```


## License: unknown
https://github.com/memochou1993/blog/tree/38ea0079b09d7cb1a5d3bd76ae0816604b8991a6/source/_posts/2023/08/2023-08-21-%E5%9C%A8-Next-13-%E4%BD%BF%E7%94%A8-NextAuth-js-%E8%AA%8D%E8%AD%89%E5%A5%97%E4%BB%B6.md

```
.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```
```

