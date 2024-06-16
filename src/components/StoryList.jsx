import React, { useState, useEffect } from 'react';
import { Box, Text, Link, VStack, Input, useColorMode, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import axios from 'axios';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const top5StoryIds = response.data.slice(0, 5);
        const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storyResponses = await Promise.all(storyPromises);
        const storiesData = storyResponses.map(res => res.data);
        setStories(storiesData);
        setFilteredStories(storiesData);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </Box>
      <VStack spacing={4} align="stretch">
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
            <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
            <Text>Upvotes: {story.score}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default StoryList;