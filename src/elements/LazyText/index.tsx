import React from 'react';
import { Skeleton, Text } from '@chakra-ui/react';

const LazyText: React.FC<{ text: string | number | null }> = ({ text }) => (
  <Skeleton flex="1" height="20px" isLoaded={!!text}>
    <Text>{text}</Text>
  </Skeleton>
);

export default LazyText;
