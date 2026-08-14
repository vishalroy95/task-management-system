import mongoose from "mongoose";

import { CommentSchema } from "../modules/comments/entities/comment.entity";
import { LabelSchema } from "../modules/labels/entities/label.entity";
import { ProjectSchema } from "../modules/projects/entities/project.entity";
import { ResourceSchema } from "../modules/resources/entities/resource.entity";
import { SubtaskSchema } from "../modules/subtasks/entities/subtask.entity";
import { TaskUpdateSchema } from "../modules/tasks/entities/task-update.entity";
import { TaskSchema } from "../modules/tasks/entities/task.entity";
import { TeamSchema } from "../modules/teams/entities/team.entity";
import { UserSchema } from "../modules/users/entities/user.entity";
import { WorkspaceSchema } from "../modules/workspaces/entities/workspace.entity";
import { demoSeedIds, seedData } from "./seed-data";

const mongoUri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/ag_assignment";

type SeedRecord = { id: string };

const WorkspaceModel = mongoose.model("Workspace", WorkspaceSchema);
const UserModel = mongoose.model("User", UserSchema);
const TeamModel = mongoose.model("Team", TeamSchema);
const ProjectModel = mongoose.model("Project", ProjectSchema);
const TaskModel = mongoose.model("Task", TaskSchema);
const TaskUpdateModel = mongoose.model("TaskUpdate", TaskUpdateSchema);
const LabelModel = mongoose.model("Label", LabelSchema);
const CommentModel = mongoose.model("Comment", CommentSchema);
const SubtaskModel = mongoose.model("Subtask", SubtaskSchema);
const ResourceModel = mongoose.model("Resource", ResourceSchema);

async function seed() {
  await mongoose.connect(mongoUri);

  try {
    await clearDemoData();
    await upsertDemoData();

    const counts = await getSeedCounts();
    const verification = await verifySeedReferences();

    if (!verification.valid) {
      throw new Error(`Seed reference verification failed: ${verification.issues.join("; ")}`);
    }

    console.log(JSON.stringify({
      database: mongoose.connection.name,
      records: counts,
      referencesValid: verification.valid,
      status: "seeded",
    }, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

async function clearDemoData() {
  const clearOperations = [
    [CommentModel, demoSeedIds.comments],
    [LabelModel, demoSeedIds.labels],
    [ProjectModel, demoSeedIds.projects],
    [ResourceModel, demoSeedIds.resources],
    [SubtaskModel, demoSeedIds.subtasks],
    [TaskModel, demoSeedIds.tasks],
    [TaskUpdateModel, demoSeedIds.taskUpdates],
    [TeamModel, demoSeedIds.teams],
    [UserModel, demoSeedIds.users],
    [WorkspaceModel, demoSeedIds.workspaces],
  ] as const;

  await Promise.all(clearOperations.map(([model, ids]) => {
    const typedModel = model as typeof model & {
      deleteMany: (filter: { id: { $in: string[] } }) => Promise<unknown>;
    };

    return typedModel.deleteMany({ id: { $in: ids } });
  }));
}

async function upsertDemoData() {
  await Promise.all([
    ...seedData.workspaces.map((workspace) => upsertRecord(WorkspaceModel, workspace)),
    ...seedData.users.map((user) => upsertRecord(UserModel, user)),
    ...seedData.teams.map((team) => upsertRecord(TeamModel, team)),
    ...seedData.projects.map((project) => upsertRecord(ProjectModel, project)),
    ...seedData.labels.map((label) => upsertRecord(LabelModel, label)),
    ...seedData.tasks.map((task) => upsertRecord(TaskModel, task)),
    ...seedData.subtasks.map((subtask) => upsertRecord(SubtaskModel, subtask)),
    ...seedData.comments.map((comment) => upsertRecord(CommentModel, comment)),
    ...seedData.resources.map((resource) => upsertRecord(ResourceModel, resource)),
    ...seedData.taskUpdates.map((taskUpdate) => upsertRecord(TaskUpdateModel, taskUpdate)),
  ]);
}

async function upsertRecord(model: unknown, payload: SeedRecord) {
  const typedModel = model as {
    updateOne: (filter: { id: string }, update: { $set: SeedRecord }, options: { upsert: boolean }) => Promise<unknown>;
  };

  await typedModel.updateOne({ id: payload.id }, { $set: payload }, { upsert: true });
}

async function getSeedCounts() {
  const [
    workspaces,
    users,
    teams,
    projects,
    labels,
    tasks,
    subtasks,
    comments,
    resources,
    taskUpdates,
  ] = await Promise.all([
    WorkspaceModel.countDocuments({ id: { $in: demoSeedIds.workspaces } }),
    UserModel.countDocuments({ id: { $in: demoSeedIds.users } }),
    TeamModel.countDocuments({ id: { $in: demoSeedIds.teams } }),
    ProjectModel.countDocuments({ id: { $in: demoSeedIds.projects } }),
    LabelModel.countDocuments({ id: { $in: demoSeedIds.labels } }),
    TaskModel.countDocuments({ id: { $in: demoSeedIds.tasks } }),
    SubtaskModel.countDocuments({ id: { $in: demoSeedIds.subtasks } }),
    CommentModel.countDocuments({ id: { $in: demoSeedIds.comments } }),
    ResourceModel.countDocuments({ id: { $in: demoSeedIds.resources } }),
    TaskUpdateModel.countDocuments({ id: { $in: demoSeedIds.taskUpdates } }),
  ]);

  return {
    comments,
    labels,
    projects,
    resources,
    subtasks,
    taskUpdates,
    tasks,
    teams,
    users,
    workspaces,
  };
}

async function verifySeedReferences() {
  const [workspaces, users, teams, projects, labels, tasks, subtasks, comments, resources, taskUpdates] =
    await Promise.all([
      WorkspaceModel.find({ id: { $in: demoSeedIds.workspaces } }).lean().exec(),
      UserModel.find({ id: { $in: demoSeedIds.users } }).lean().exec(),
      TeamModel.find({ id: { $in: demoSeedIds.teams } }).lean().exec(),
      ProjectModel.find({ id: { $in: demoSeedIds.projects } }).lean().exec(),
      LabelModel.find({ id: { $in: demoSeedIds.labels } }).lean().exec(),
      TaskModel.find({ id: { $in: demoSeedIds.tasks } }).lean().exec(),
      SubtaskModel.find({ id: { $in: demoSeedIds.subtasks } }).lean().exec(),
      CommentModel.find({ id: { $in: demoSeedIds.comments } }).lean().exec(),
      ResourceModel.find({ id: { $in: demoSeedIds.resources } }).lean().exec(),
      TaskUpdateModel.find({ id: { $in: demoSeedIds.taskUpdates } }).lean().exec(),
    ]);

  const toIdList = (records: Array<{ id?: string }>) => records.map((record) => record.id).filter((id): id is string => Boolean(id));

  const workspaceIds = new Set(toIdList(workspaces));
  const userIds = new Set(toIdList(users));
  const teamIds = new Set(toIdList(teams));
  const projectIds = new Set(toIdList(projects));
  const labelIds = new Set(toIdList(labels));
  const taskIds = new Set(toIdList(tasks));
  const subtaskIds = new Set(toIdList(subtasks));
  const commentIds = new Set(toIdList(comments));
  const resourceIds = new Set(toIdList(resources));
  const taskUpdateIds = new Set(toIdList(taskUpdates));

  const issues: string[] = [];

  for (const workspace of seedData.workspaces) {
    if (!allExist(workspace.users, userIds)) issues.push(`workspace ${workspace.id} references missing users`);
    if (!allExist(workspace.teams, teamIds)) issues.push(`workspace ${workspace.id} references missing teams`);
    if (!allExist(workspace.projects, projectIds)) issues.push(`workspace ${workspace.id} references missing projects`);
  }

  for (const user of seedData.users) {
    if (!allExist(user.workspaces, workspaceIds)) issues.push(`user ${user.id} references missing workspaces`);
    if (!allExist(user.teams, teamIds)) issues.push(`user ${user.id} references missing teams`);
    if (!allExist(user.assignedTasks, taskIds)) issues.push(`user ${user.id} references missing assigned tasks`);
    if (!allExist(user.ledProjects, projectIds)) issues.push(`user ${user.id} references missing led projects`);
    if (!allExist(user.reportedTasks, taskIds)) issues.push(`user ${user.id} references missing reported tasks`);
    if (!allExist(user.comments, commentIds)) issues.push(`user ${user.id} references missing comments`);
    if (!allExist(user.taskUpdates, taskUpdateIds)) issues.push(`user ${user.id} references missing task updates`);
  }

  for (const team of seedData.teams) {
    if (!workspaceIds.has(team.workspaceId)) issues.push(`team ${team.id} references missing workspace`);
    if (!allExist(team.members, userIds)) issues.push(`team ${team.id} references missing members`);
    if (!allExist(team.projects, projectIds)) issues.push(`team ${team.id} references missing projects`);
  }

  for (const project of seedData.projects) {
    if (!workspaceIds.has(project.workspaceId)) issues.push(`project ${project.id} references missing workspace`);
    if (project.leadId && !userIds.has(project.leadId)) issues.push(`project ${project.id} references missing lead`);
    if (project.teamId && !teamIds.has(project.teamId)) issues.push(`project ${project.id} references missing team`);
    if (!allExist(project.tasks, taskIds)) issues.push(`project ${project.id} references missing tasks`);
  }

  for (const label of seedData.labels) {
    if (!workspaceIds.has(label.workspaceId)) issues.push(`label ${label.id} references missing workspace`);
    if (!allExist(label.tasks, taskIds)) issues.push(`label ${label.id} references missing tasks`);
  }

  for (const task of seedData.tasks) {
    if (!projectIds.has(task.projectId)) issues.push(`task ${task.id} references missing project`);
    if (task.reporterId && !userIds.has(task.reporterId)) issues.push(`task ${task.id} references missing reporter`);
    if (!allExist(task.members, userIds)) issues.push(`task ${task.id} references missing members`);
    if (!allExist(task.labels, labelIds)) issues.push(`task ${task.id} references missing labels`);
    if (!allExist(task.subtasks, subtaskIds)) issues.push(`task ${task.id} references missing subtasks`);
    if (!allExist(task.comments, commentIds)) issues.push(`task ${task.id} references missing comments`);
    if (!allExist(task.resources, resourceIds)) issues.push(`task ${task.id} references missing resources`);
    if (!allExist(task.updates, taskUpdateIds)) issues.push(`task ${task.id} references missing updates`);
  }

  for (const subtask of seedData.subtasks) {
    if (!taskIds.has(subtask.taskId)) issues.push(`subtask ${subtask.id} references missing task`);
  }

  for (const comment of seedData.comments) {
    if (!taskIds.has(comment.taskId)) issues.push(`comment ${comment.id} references missing task`);
    if (comment.authorId && !userIds.has(comment.authorId)) issues.push(`comment ${comment.id} references missing author`);
  }

  for (const resource of seedData.resources) {
    if (!taskIds.has(resource.taskId)) issues.push(`resource ${resource.id} references missing task`);
  }

  for (const taskUpdate of seedData.taskUpdates) {
    if (!taskIds.has(taskUpdate.taskId)) issues.push(`task update ${taskUpdate.id} references missing task`);
    if (taskUpdate.authorId && !userIds.has(taskUpdate.authorId)) issues.push(`task update ${taskUpdate.id} references missing author`);
  }

  return { issues, valid: issues.length === 0 };
}

function allExist(values: string[], allowedValues: Set<string>) {
  return values.every((value) => allowedValues.has(value));
}

void seed().catch(async (error: unknown) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
