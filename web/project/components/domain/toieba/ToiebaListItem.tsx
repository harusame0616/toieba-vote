import { faComment, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

interface Prop {
  toieba: {
    theme: string;
    voteCount: number;
    commentCount: number;
    postedAt: string;
  };
}

const ToiebaListItem = (prop: Prop) => {
  return (
    <Box borderBottom="1px solid silver" width="100%" padding="10px">
      <Typography
        fontSize="1.2rem"
        color="black"
        sx={{ wordBreak: 'break-all' }}
      >
        {prop.toieba.theme} といえば
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" gap="20px" fontSize="0.8rem" marginBottom="5px">
          <Box display="flex" gap="5px" alignItems="center">
            <FontAwesomeIcon icon={faTicket} />
            {prop.toieba.voteCount || 0}
          </Box>
          <Box display="flex" gap="5px" alignItems="center">
            <FontAwesomeIcon icon={faComment} />
            {prop.toieba.commentCount || 0}
          </Box>
        </Box>
        <Box
          display="flex"
          gap="5px"
          alignItems="center"
          color="silver"
          fontSize="0.8rem"
        >
          {dayjs.utc(prop.toieba.postedAt).format('YYYY/MM/DD HH:mm')}
        </Box>
      </Box>
    </Box>
  );
};

export default ToiebaListItem;
