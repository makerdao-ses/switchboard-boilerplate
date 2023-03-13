import { rule, shield } from 'graphql-shield';
import { ApolloError } from 'apollo-server-core';

const rules = {
  isAuthenticatedUser: rule()((_, __, { userId }) => Boolean(userId)),
};

export const permissionsAuth = shield(
  {
    Query: {
      me: rules.isAuthenticatedUser,
    },
  },
  {
    allowExternalErrors: process.env.NODE_ENV !== 'production',
    fallbackError: new ApolloError('Not authorized', 'NOT_AUTHORIZED'),
  },
);
