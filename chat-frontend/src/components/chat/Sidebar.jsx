// Sidebar.js
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/auth';
import './Sidebar.css'

const Sidebar = ({ changeChannel, currentChannel, channels }) => {

    return (
        <div className='sidebar'>
            <div className="p-3">
                <h5 className="mb-3">Channels</h5>
                <ListGroup>
                    {channels.map((channel) => (
                        <ListGroup.Item
                            key={channel.id}
                            action
                            active={channel.name === currentChannel}
                            onClick={() => changeChannel(channel.name)}
                        >
                            {channel.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
};

export default Sidebar;
