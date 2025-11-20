import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import groupService from '../services/groupService';
import groupMemberService from '../services/groupMemberService';
import hobbyService from '../services/hobbyService';
import userHobbyService from '../services/userHobbyService';
import userService from '../services/userService';
import './css/GroupsPage.css';

const GroupsPage = () => {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [userHobbies, setUserHobbies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupMembers, setGroupMembers] = useState({});
  const [userMemberships, setUserMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberUsers, setMemberUsers] = useState({});
  const [joiningGroupId, setJoiningGroupId] = useState(null);

  const [newGroup, setNewGroup] = useState({
    hobby_id: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        let userId = null;
        if (authUser && authUser.id) {
          userId = authUser.id;
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed.id;
          }
        }

        if (userId) {
          const [userData, groupsData, hobbiesData, userHobbiesData, membersData, membershipsData] = await Promise.all([
            userService.getUserById(userId),
            groupService.getAllGroups(),
            hobbyService.getAllHobbies(),
            userHobbyService.getUserHobbyById(userId),
            groupMemberService.getAllGroupMembers(),
            groupMemberService.getGroupMemberById(userId)
          ]);

          if (userData) setCurrentUser(userData);
          if (groupsData) setGroups(groupsData);
          if (hobbiesData) setHobbies(hobbiesData);
          if (userHobbiesData) setUserHobbies(userHobbiesData);
          if (membersData) {
            const membersByGroup = {};
            membersData.forEach(member => {
              if (!membersByGroup[member.group_id]) {
                membersByGroup[member.group_id] = [];
              }
              membersByGroup[member.group_id].push(member);
            });
            setGroupMembers(membersByGroup);

            // Fetch user info for all members
            const userIds = [...new Set(membersData.map(m => m.user_id))];
            const usersMap = {};
            await Promise.all(
              userIds.map(async (uid) => {
                try {
                  const user = await userService.getUserById(uid);
                  if (user) {
                    usersMap[uid] = `${user.first_name} ${user.last_name} (${user.username})`;
                  }
                } catch {
                  usersMap[uid] = `User ${uid}`;
                }
              })
            );
            setMemberUsers(usersMap);
          }
          if (membershipsData) setUserMemberships(membershipsData);
        }

        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, navigate]);

  // Filter groups to only show those for hobbies the user has
  const getUserHobbyIds = () => {
    return userHobbies.map(uh => uh.hobby_id);
  };

  const filteredGroups = groups.filter(group => {
    const userHobbyIds = getUserHobbyIds();
    return userHobbyIds.includes(group.hobby_id);
  });

  const isMember = (groupId) => {
    return userMemberships.some(m => m.group_id === groupId);
  };

  const isAdmin = (groupId) => {
    const membership = userMemberships.find(m => m.group_id === groupId);
    return membership && membership.admin;
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) {
      setError('User not found');
      return;
    }

    try {
      const groupData = {
        name: newGroup.name,
        description: newGroup.description || null,
        hobby_id: parseInt(newGroup.hobby_id),
        num_members: 1,
        created_by: currentUser.id
      };

      const created = await groupService.createGroup(groupData);
      if (created) {
        // Add creator as admin member
        await groupMemberService.createGroupMember({
          groupId: created.id,
          userId: currentUser.id,
          admin: true
        });

        // Refresh data
        const [groupsData, membersData, membershipsData] = await Promise.all([
          groupService.getAllGroups(),
          groupMemberService.getAllGroupMembers(),
          groupMemberService.getGroupMemberById(currentUser.id)
        ]);

        if (groupsData) setGroups(groupsData);
        if (membersData) {
          const membersByGroup = {};
          membersData.forEach(member => {
            if (!membersByGroup[member.group_id]) {
              membersByGroup[member.group_id] = [];
            }
            membersByGroup[member.group_id].push(member);
          });
          setGroupMembers(membersByGroup);
        }
        if (membershipsData) setUserMemberships(membershipsData);

        setNewGroup({ hobby_id: '', name: '', description: '' });
        setShowCreateForm(false);
        setError(null);
      }
    } catch (error) {
      setError(error.message || 'Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!currentUser || !currentUser.id) {
      setError('User not found');
      return;
    }

    // Prevent double-clicks
    if (joiningGroupId === groupId) {
      return;
    }

    try {
      setJoiningGroupId(groupId);
      await groupMemberService.createGroupMember({
        groupId: groupId,
        userId: currentUser.id,
        admin: false
      });

      // Update group member count
      const group = groups.find(g => g.id === groupId);
      if (group) {
        await groupService.updateGroup(groupId, {
          ...group,
          num_members: group.num_members + 1
        });
      }

      // Refresh data
      const [groupsData, membersData, membershipsData] = await Promise.all([
        groupService.getAllGroups(),
        groupMemberService.getAllGroupMembers(),
        groupMemberService.getGroupMemberById(currentUser.id)
      ]);

      if (groupsData) setGroups(groupsData);
      if (membersData) {
        const membersByGroup = {};
        membersData.forEach(member => {
          if (!membersByGroup[member.group_id]) {
            membersByGroup[member.group_id] = [];
          }
          membersByGroup[member.group_id].push(member);
        });
        setGroupMembers(membersByGroup);
      }
      if (membershipsData) setUserMemberships(membershipsData);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to join group');
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!currentUser || !currentUser.id) {
      setError('User not found');
      return;
    }

    try {
      await groupMemberService.deleteGroupMember(groupId, currentUser.id);

      // Update group member count
      const group = groups.find(g => g.id === groupId);
      if (group) {
        await groupService.updateGroup(groupId, {
          ...group,
          num_members: Math.max(0, group.num_members - 1)
        });
      }

      // Refresh data
      const [groupsData, membersData, membershipsData] = await Promise.all([
        groupService.getAllGroups(),
        groupMemberService.getAllGroupMembers(),
        groupMemberService.getGroupMemberById(currentUser.id)
      ]);

      if (groupsData) setGroups(groupsData);
      if (membersData) {
        const membersByGroup = {};
        membersData.forEach(member => {
          if (!membersByGroup[member.group_id]) {
            membersByGroup[member.group_id] = [];
          }
          membersByGroup[member.group_id].push(member);
        });
        setGroupMembers(membersByGroup);
      }
      if (membershipsData) setUserMemberships(membershipsData);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to leave group');
    }
  };

  const handleKickMember = async (groupId, userId) => {
    try {
      await groupMemberService.deleteGroupMember(groupId, userId);

      // Update group member count
      const group = groups.find(g => g.id === groupId);
      if (group) {
        await groupService.updateGroup(groupId, {
          ...group,
          num_members: Math.max(0, group.num_members - 1)
        });
      }

      // Refresh data
      const [groupsData, membersData] = await Promise.all([
        groupService.getAllGroups(),
        groupMemberService.getAllGroupMembers()
      ]);

      if (groupsData) setGroups(groupsData);
      if (membersData) {
        const membersByGroup = {};
        membersData.forEach(member => {
          if (!membersByGroup[member.group_id]) {
            membersByGroup[member.group_id] = [];
          }
          membersByGroup[member.group_id].push(member);
        });
        setGroupMembers(membersByGroup);
      }
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to kick member');
    }
  };

  const handleToggleAdmin = async (groupId, userId, currentAdminStatus) => {
    try {
      await groupMemberService.updateGroupMember(groupId, userId, !currentAdminStatus);

      // Refresh data
      const membersData = await groupMemberService.getAllGroupMembers();
      if (membersData) {
        const membersByGroup = {};
        membersData.forEach(member => {
          if (!membersByGroup[member.group_id]) {
            membersByGroup[member.group_id] = [];
          }
          membersByGroup[member.group_id].push(member);
        });
        setGroupMembers(membersByGroup);
      }
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to update admin status');
    }
  };

  const getHobbyName = (hobbyId) => {
    const hobby = hobbies.find(h => h.id === hobbyId);
    return hobby ? hobby.name : `Hobby ${hobbyId}`;
  };

  const getUserInfo = (userId) => {
    return memberUsers[userId] || `User ${userId}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading groups...</div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="container groups-container">
      <div className="groups-header">
        <div className="groups-header-content">
          <h1>Explore groups</h1>
          <p className="groups-subtitle">
            Explore the groups of other users and join them. Or you can create a new group on your own!
          </p>
      </div>
    </div>
      <div className="groups-header-actions" style ={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px'}}>
        <button
            className="create-group-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create Group'}
          </button>
      </div>
      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form onSubmit={handleCreateGroup} className="create-group-form">
          <h2>Create New Group</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hobby_id">Hobby *</label>
              <select
                id="hobby_id"
                value={newGroup.hobby_id}
                onChange={(e) => setNewGroup({ ...newGroup, hobby_id: e.target.value })}
                required
              >
                <option value="">Select a hobby</option>
                {userHobbies.map(uh => {
                  const hobby = hobbies.find(h => h.id === uh.hobby_id);
                  return hobby ? (
                    <option key={hobby.id} value={hobby.id}>{hobby.name}</option>
                  ) : null;
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Group Name *</label>
              <input
                type="text"
                id="name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn">Create Group</button>
        </form>
      )}

      <div className="groups-info">
        <p>Showing groups for your hobbies: {userHobbies.map(uh => {
          const hobby = hobbies.find(h => h.id === uh.hobby_id);
          return hobby ? hobby.name : null;
        }).filter(Boolean).join(', ')}</p>
      </div>

      <div className="groups-grid">
        {filteredGroups.length === 0 ? (
          <div className="no-groups">
            <p>No groups found for your hobbies. Create the first one!</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const members = groupMembers[group.id] || [];
            const memberCount = members.length;
            const hobby = hobbies.find(h => h.id === group.hobby_id);
            const isUserMember = isMember(group.id);
            const isUserAdmin = isAdmin(group.id);

            return (
              <div key={group.id} className={`group-card ${isUserAdmin ? 'admin-group' : ''}`}>
                <div className="group-header">
                  <div className="group-badge">
                    {isUserAdmin && <span className="admin-badge">👑 Admin</span>}
                    {isUserMember && !isUserAdmin && <span className="member-badge">✓ Member</span>}
                    {hobby && <span className="hobby-badge">{hobby.name}</span>}
                  </div>
                </div>
                <h3 className="group-title">{group.name}</h3>
                {group.description && (
                  <p className="group-description">{group.description}</p>
                )}
                <div className="group-details">
                  <div className="group-detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                  </div>
                </div>
                <div className="group-actions">
                  {!isUserMember ? (
                    <button
                      className="join-btn"
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={joiningGroupId === group.id}
                    >
                      {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                    </button>
                  ) : (
                    <>
                      {isUserAdmin && (
                        <button
                          className="manage-members-btn"
                          onClick={() => setSelectedGroup(group.id)}
                        >
                          Manage Members ({memberCount})
                        </button>
                      )}
                      <button
                        className="leave-btn"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Leave Group
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedGroup && (
        <div className="modal-overlay" onClick={() => setSelectedGroup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Group Members</h2>
              <button className="close-btn" onClick={() => setSelectedGroup(null)}>×</button>
            </div>
            <div className="members-list">
              {groupMembers[selectedGroup] && groupMembers[selectedGroup].length > 0 ? (
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Joined At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupMembers[selectedGroup].map((member, index) => {
                      const isCurrentUser = member.user_id === currentUser?.id;
                      const isMemberAdmin = member.admin;
                      const canModify = isAdmin(selectedGroup) && !isCurrentUser;

                      return (
                        <tr key={index}>
                          <td>{getUserInfo(member.user_id)}</td>
                          <td>
                            <span className={`role-badge ${isMemberAdmin ? 'admin' : 'member'}`}>
                              {isMemberAdmin ? 'Admin' : 'Member'}
                            </span>
                          </td>
                          <td>{new Date(member.joined_at).toLocaleString()}</td>
                          <td>
                            {canModify && (
                              <div className="member-actions">
                                <button
                                  className="action-btn promote-btn"
                                  onClick={() => handleToggleAdmin(selectedGroup, member.user_id, isMemberAdmin)}
                                  title={isMemberAdmin ? 'Remove Admin' : 'Make Admin'}
                                >
                                  {isMemberAdmin ? '👑 Remove Admin' : '👑 Make Admin'}
                                </button>
                                <button
                                  className="action-btn kick-btn"
                                  onClick={() => handleKickMember(selectedGroup, member.user_id)}
                                  title="Kick Member"
                                >
                                  🚪 Kick
                                </button>
                              </div>
                            )}
                            {isCurrentUser && <span className="current-user-label">You</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="no-members">No members yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
