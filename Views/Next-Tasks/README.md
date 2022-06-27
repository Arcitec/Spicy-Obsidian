# Next-Tasks GTD.

Intelligently displays all of your project's "next tasks", with a focus on extremely high performance and the ability to easily customize absolutely everything.

The algorithm is micro-optimized to give you the fastest possible search results (hundreds of milliseconds faster than Dataview's own built-in, chained filtering/query features), while still implementing tons of advanced features that allow you to change its output and behaviors to suit your exact personal tastes.

It works based on the concept of "searching for the next, available, tagged tasks" across all of your project-documents. Its main purpose is to make it very easy to implement the **GTD (Getting Things Done)** workflow in Obsidian, but Next-Tasks can also be used without relying on GTD.

A short description of GTD would be "a task-centric workflow, where all tasks are assigned to various contexts such as phone, home, online, people, etc". The goal is to assign relevant contexts to all tasks, which tells you what is *required* for the completion of that task, and then allows you to "shut off your brain" and let the system to decide what tasks you should work on.

For example, if you're on the phone and you want to finish some more phone-related tasks, you'd simply look at the "next available tasks tagged with the phone-context", and start performing those tasks. Next, you may decide to perform some "online" tasks, so you'd look at the "next available tasks tagged with the online-context", and start performing those tasks online.

This system allows your brain to relax and stop worrying about the tasks that you can't complete at your current location, and helps you find the tasks that you can actually perform where you are. For example, it would be absurd to be distracted by "office"-related tasks while you're at home, or seeing "online"-related tasks while you don't have an internet connection.

The GTD system takes care of all of that for you, and helps you minimize stress and maximize focus, rapidly whittling down all of the tasks in your projects, by just naturally working via their logical "location/area"-contexts and performing their individual tasks, rather than feeling overwhelmed by manually staring at long and intimidating lists of separate, monolithic projects.

The per-context "GTD" system also helps your brain stay energized and "in the flow", by reducing the context-jumping that occurs with regular, rigid "step by step" task lists. However, you're still able to work on your individual project task lists too, by simply opening that project's document directly. You can simply click anywhere on the highlighted row in the Next-Tasks search results to jump directly to that project's document, if you want to focus on a specific project.

Next-Tasks gives you the best of both worlds, and turns Obsidian into a powerful GTD task manager!


## Installation

- You need the [Obsidian](https://obsidian.md) application, and you must also install the **Dataview** community-plugin (by Michael Brenan). The plugin can be installed from within Obsidian's settings.
- The Dataview plugin's settings **must** be configured to "Enable JavaScript Queries". I also recommend enabling "Automatic Task Completion Tracking" in its settings, if you want Dataview to automatically append the task-completion dates to any tasks that you check off in your Next-Tasks dashboards (however, that feature only works from the dashboard, not from inside the individual project documents).
- Place the `Next-Tasks` folder within your desired "Dataview Views" folder inside your Obsidian Vault, to install this "custom view". I use the folder structure "`Internal/Views/Next-Tasks`" in all examples. Whichever location you choose is the path you'll have to use in all `dv.view()` function calls.
- If you want to improve your document creation workflow, I also suggest checking out the following community-plugins (but they aren't necessary): **QuickAdd** (by Christian B. B. Houmann) for quickly generating and filling out well-structured project documents from "fill-in templates", and **Templater** (by SilentVoid) for advanced template insertions into existing documents.


## Parameters

The Next-Tasks view accepts a large amount of custom parameters.

- `folder`: (Required) Which folder to search in (relative to the vault's root). For example, if you're using our suggested GTD folder structure, the correct path would be `"Tasks/Projects"`. You can *only* provide **one** folder, due to limitations of the Dataview API.
- `search`: (Required) Array of `#tags` to search for. Must be at least 1 tag. Their order doesn't matter. Nested tags (`#foo/bar/baz`) are supported, and you can even search for their broader "parent" tags (such as just `#foo`) to capture *all* nested tags. All tags are case-sensitive. Tasks will only be shown if they contain *all* tags from the search query.
- `show_headers`: *(Optional)* Whether to group tasks by the document they came from. Defaults to `true`.
- `msg_no_tasks`: *(Optional)* Message to display if there are no results. Defaults to `"No tasks."`.
- `parallel_keyword`: *(Optional)* Allows you to choose your own keyword for enabling "parallel task-list" mode, including *partial* support for Unicode (such as Emojis) if desired. To ensure high-performance search results, the matching is done in 8-bit (non-Unicode) character mode, which means that case-insensitive matching is *only* possible if you write your keyword using the English alphabet (a-z). Emojis always work perfectly. Support for words in other languages will depend on how complex their byte sequences are. See "Task List Behaviors" section for more details about parallel task lists. Defaults to the word `"parallel"`.
- `result_cb`: *(Optional)* Custom result callback, if you want to further process the search results and display them in your own way. Your callback receives two parameters, `(next_tasks, show_headers)`, which is the plain JavaScript array of found tasks, and the "show headers" boolean that was provided to this view. The callback is only triggered if there was at least 1 search result, otherwise the `msg_no_tasks` message is displayed instead. Defaults to presenting the results as a `dv.taskList()`.


## Task List Behaviors

- All tasks under a markdown `# header` section are treated as part of "that section's task list". Even if you separate your task lists with multiple newlines or other markdown elements, they are all still part of "that section" (and are treated as belonging to the same task-list). This is due to a limitation of Dataview's markdown list-parser.
- A project document can contain multiple sub-sections/sub-projects, which you simply denote by creating more `# header` sections. Every task list section is independently processed. This allows you to split a single project-document into multiple, separated sub-projects with their own, independently scanned task lists.
- Every `# header` title inside a project-document **MUST** be unique. Having unique section titles is the *only* way we can accurately identify which section a task belongs to!
- By default, all sections and their tasks are treated as **Sequential** (step-by-step) task lists, meaning that we only scan the *first* unfinished task of each section. This is done for two reasons: It's the most common way to organize task lists ("task 1 must be finished before we can move on to task 2"), and it also helps speed up the search-processing since we only need to analyze 1 unfinished task per section.
- You can enable **Parallel** mode on a per-section basis, by putting the word "Parallel" at the start of your section title. For example, `# Parallel: Organize Our Community`. This tells the processing that the section's tasks are allowed to run in parallel, meaning that all tasks will be scanned and *all* matching tasks from that section will be displayed (even ones that are indented sub-tasks of other, non-matching tasks). This is useful if you have a task-list where the order of completion doesn't matter.
- We had to use this custom "header title" solution rather than "Dataview's inline attributes" (`[attr:: value]`) due to Dataview's inability to parse those attributes in relation to the task lists. However, our solution ends up being a nicer and easier syntax overall!
- The word "Parallel" can be written in many different ways, as long as they all internally evaluate to the case-insensitive phrase "`Parallel `" (that's "parallel" followed by a space). The Markdown parser of Dataview internally takes care of removing most of the special characters (such as `:()-`), which means that all of the following examples are equivalent:
	- `# Parallel: Task List Title`
	- `# parallel: Task List Title`
	- `# PARALLEL: Task List Title`
	- `# Parallel - Task List Title`
	- `# parallel Task List Title`
	- `# (Parallel) Task List Title`
	- and more...
- You can use the `parallel_keyword` option to choose your own custom keyword instead. You are even able to use Emojis (😹) and other Unicode symbols (there are examples of that in the "Usage Examples" section). However, the case-insensitive matching is only available if you use the English alphabet (a-z). No matter which word or symbol you choose, your project-document's `# headers` must always contain a space after the keyword, before the rest of the header-title (see previous examples for valid header formats), since the space is used as the separator between the "parallel keyword" prefix and the rest of the title.


## Usage Examples

### Using the "Next-Tasks" Data View

Simply include a `dataviewjs` code-block in any of your documents, to create a live "dashboard" of all available "next tasks" that contain *all* of the given search-tags.

Here's an example which displays all tasks from all documents within the `Tasks/Projects` folder, which are available as "next tasks" (not blocked by other, unfinished tasks), and which must contain the two tags `#context/online` and `#prio/high`.

The `// comment` lines are only included for demonstration of all parameters, and can be deleted.

~~~markdown
```dataviewjs
await dv.view("Internal/Views/Next-Tasks", {
	folder: "Tasks/Projects",
	search: ["#context/online", "#prio/high"],
	//show_headers: false,
	//msg_no_tasks: "No tasks.",
	//parallel_keyword: "parallel",
	//result_cb: (next_tasks, show_headers) => {
	//	console.log(next_tasks, show_headers);
	//},
});
```
~~~

### Project Document Structure

The following are the best practices for how to structure the contents of your project-documents, to get the best search results.

- You are able to use nested sub-folders within your "Projects" folder, if you want to.
- It's recommended that you create at least 1 document per project (more is of course possible too), since that will give you nice "project name" headers/groupings for the search results (when `show_headers` is enabled).
- If you have sub-projects, it's best to store them *all* as separate `# header` sections within a single project-document, to keep all tasks for that project in the same place for an easy "big-picture overview" and easy re-organizing.
- All tasks within a `# header` section are treated as part of "that section", no matter how many newlines or other markdown features you use between your tasks there. So if you want to create separate task-lists, you need to separate them with different `# headers`.
- All `# headers` must have unique names, otherwise they'll be interpreted as being "the same header", due to limitations of Dataview's document parser.
- All task-lists (sections) default to "sequential" mode. However, as mentioned in the "Task List Behaviors" information (which you should *carefully* read), you are also able to create parallel task-lists. The "parallel" keyword can be customized and written in different ways, so that you can choose your own preferred keyword-style.
- Sub-tasks within other tasks must use standard indentation (just hit `Tab` to indent one step, for each extra task-nesting level). This ensures that you'll see the task *and* all of its sub-tasks when you look at the search results. If a parent-task matches, you'll see the parent and *all* of its nested child-tasks (regardless of whether its children also match or not). If your list is in "parallel" mode, all matching child-tasks (and all of *their* children) are individually included even if the higher-level parent tasks don't match. If you don't like this "deeper scanning" in parallel mode, then you should simply *not* tag your deep child-tasks (so that they won't match), or restructure your project's task-hierarchy so that you get the desired results (for example by moving deeply nested sub-task trees into individual `# header` sections instead).
- Your tasks are able to contain markdown formatting and links, such as `- [ ] Research [[My Website Project]] to find solutions #context/online`.
- Your task-lists *aren't* supposed to be some kind of "bloated mega-repository of *all* information about the project". Always use *very short and readable* descriptions for all of your tasks, to avoid massive clutter in your task-lists. If you feel the need for longer descriptions, it's a strong sign that you need more external information and that you should simply create a link from the task to your long, free-form `Notes`-documents or external websites (such as GitHub issues) instead. Think of it as "Projects are just simple task-lists, and external Notes are where you should store more detailed information".
- Always remember: If it would take longer to write down and tag a task, than it would take to actually *do the task,* then don't waste your time writing it down. Just do it. (This is just a general GTD principle.)
- Tagging your tasks is the main way that you'll be able to search for tasks. It's recommended that you use a small set of tags, since excessive tagging makes a tagging system cluttered and useless and less productive. It's also recommended that you use "nested tags" (such as `#context/online` and `#context/phone`), since they give you a clean tag hierarchy and make it possible to search for broader terms (for example, `#context` would find all tasks that use *any* of the specific "nested" context-tags from the previous example).
- If you use a priority-system to specify how important different tasks are, it's also recommended that you put the priority tag first, before all other tags, since that makes it much easier for you to expand the task's tag-list cleanly without having to manually move the priority tag each time. Having the priority first also helps with the general overview of the task when you're reading it.
- An example of a task that follows all of these suggestions would be `- [ ] Some short task description #prio/high #context/online #context/home`.
- When a project is totally complete, you **should always** move it out of your "Projects" folder, into an "Archive" folder, to ensure that old projects full of "useless, completed tasks" don't slow down your future searches. Archival also helps you visually de-clutter your "Projects" list, to see which ones are actually active.

Here is an example "Demo Project" document, demonstrating all of these concepts.

~~~markdown
# Write a new signup flow

All of these tasks will run sequentially (the default mode), meaning
that only the first unfinished task of the list will be scanned.

- [ ] Look at other community signup flows #prio/high #context/online 
	- [ ] GitHub
		- [ ] Signup page
		- [ ] Help page
	- [ ] GitLab Signup page
- [ ] Create flowchart for the new design #prio/high #context/computer
- [ ] Refactor current signup code and implement new design #prio/high #context/computer 
- [ ] Publish internal test version of the new system #prio/high #context/online #context/server
- [ ] Await tester feedback #prio/high #context/online 
- [ ] Publish the live version! #prio/high #context/online #context/server

# parallel: Organize the community

All of these tasks will run in parallel, allowing Next-Tasks searches
to detect any matching task regardless of their order in the list.

- [ ] Promote a new moderator #prio/high #context/online 
- [ ] Design a new logo for the forums #prio/low #context/computer
- [ ] Call Sophie about the system migration #prio/medium #context/phone #context/people/Sophie
- [ ] Look at moderation best-practices at other forums #prio/low #context/online 
~~~

### Recommended Obsidian GTD Folder Structure

This is just my recommendation for a very clean folder structure for your Obsidian vault. It corresponds to all of the examples in this guide, but you can use any folder structure you want. It's simply provided as a recommendation here, for people who need some help getting started with GTD in Obsidian!

- **Obsidian Vault** (your vault's root folder)
	- `Internal`: Holds all internal scripts and templates. You should configure Obsidian's "Settings: Files & Links: Excluded files" to exclude this folder from all searches and graphs.
		- `Templates`: Store all of your template-documents here, regardless of whether you use community-plugins such as the powerful "Templater", or Obsidian's own basic, built-in "Templates" plugin.
		- `Views`: Place all of your custom Dataview views here. Use one folder per custom view, containing that specific view's `view.js` and `view.css` (optional) files. Note that you are also able to write your own views that call "Next-Tasks", to simplify repeated parameter usage. See the "Advanced Usage: Custom Views" section of this guide for more information.
	- `Notes`: Holds your long, free-form documents, such as research clippings, articles, long project notes, and any other research materials you have collected. You're able to use any sub-folder structure you want. Just remember to be consistent with your naming and folder structure here, to make it easy to link to notes from your project-tasks.
	- `Tasks`: This is the "GTD" system's parent folder.
		- `Archive`: Move all of your completed projects into this folder, to ensure that your GTD dashboard searches never get slowed down by years of old projects. This archival also helps you to visually de-clutter your active Projects list.
		- `Contexts`: This is where you store your "dashboards" for the various contexts. Create 1 document per context within this folder, such as `Online`, and fill in your "Next-Tasks" search query there. Then you simply have to open that document to see all of your next, available "online" tasks from all of your projects. You can also create advanced, multi-query documents/dashboards, if you want to combine an overview of all contexts into one document, for example. The "Next-Tasks" code is highly optimized for performance, which makes it trivial to include many data sources in one document while still achieving very fast results!
		- `Inbox`: This is your quick "brain dump" area of the GTD system. The goal of this folder is to create 1 document per new project, and simply dumping your brain's contents/thoughts into it without caring about structure or tagging at first. It's a way to quickly relieve stress and getting things into the system, where you can relax with the knowledge that the information will be waiting for you later. When you have more energy, you should then go through and review and clean up all of the new documents, taking care to properly tag, link (such as linking certain tasks to your `Notes`), re-order and categorize all tasks into `# header` (sub-project) sections, and then finally moving the new project-documents into the `Projects` folder.
		- `Projects`: All of your active, unfinished projects live here. This is the folder structure that Next-Tasks will search through. You are encouraged to create deeper sub-folders here if you want, such as organizing the projects by what they're for (such as having sub-folders for "Personal", "Work", etc).

### Recommended Tagging System

You can use any tags you want, but it's best to use as few tags as possible, to avoid overwhelming yourself with worthless and tedious questions such as "which specific, microscopically detailed tags would apply to this exact project?", which just wastes of time and energy.

The best tagging system, if you want to properly implement GTD, is to ensure that all of your tags are relevant to the "locations/tools/people" that are required for completing those tasks.

Locations are places, such as "home", "office", etc.

Tools are things, such as "computer", "phone", etc.

People are important people that are required for completing the tasks. This is optional, but recommended, since tagging with people helps you create dashboards that can show all tasks related to specific people, for easy reference.

If you want to be able to prioritize tasks, I recommend using a very simple priority tagging system, where you only use three levels, "low", "medium" and "high".

It's also recommended that you use *nested tags* for everything, to give your documents a clean hierarchy and free up all other, non-GTD tags for usage in your Obsidian vault. Most "tag explorer" plugins for Obsidian allow you to expand/collapse nested tags, which makes it easy to hide GTD-related tags if you don't want to see them in your global tag list, for example. Personally, I use the `#context/*` namespace for all GTD contexts, `#context/people/*` for each required person, and `#prio/*` for all priorities.

Having nested tags also give you the wonderful ability to search for broader "parent" tags, such as `#context/people` to find *all* tasks tagged with other people.

Don't worry about the length/complexity of your tags, since Obsidian will auto-complete all tags for you as you type.

Note that some people also like to tag tasks by their "estimated duration", such as "`#duration/short`" (less than 10 minutes), "`#duration/medium`" (10-60 minutes), and "`#duration/long`" (1+ hours). This allows you to make dashboards of "short tasks", for example. However, I personally don't like tagging anything with durations, since it means wasting lots of time thinking about a problem and guessing about its duration ahead of time, before you've even had the time to properly visualize the problem and solutions mentally. Humans are notoriously bad at estimating time in advance, and especially when a problem hasn't been fully understood yet. The duration-tags are also completely useless unless you tag literally every task with an estimated duration (otherwise, untagged tasks won't show up in "duration"-based dashboards). So I *don't* recommend duration-tagging whatsoever. I consider it harmful.

Here are some good example tags to get you started. The indentation levels demonstrate the different levels of nested tags.

- `#prio`
	- `low`: Unimportant tasks, but which should be done someday.
	- `medium`: Important tasks, but can wait until later.
	- `high`: Urgent tasks, needs to be prioritized and done as soon as possible.
- `#context`
	- `home`: Can only be done at home.
	- `office`: Can only be done at the office/at work.
	- `errand`: Leaving the safety of your home (😨), such as going to the bank or the grocery store. Feel free to sub-divide this into frequent locations, such as `#context/errand/bank` if that seems useful to you.
	- `computer`: Can only be done at a computer (internet connection not required).
	- `online`: Can only be done online (internet connection is required). Feel free to sub-divide this into frequent websites, if you think it would be useful to have task dashboards for specific sites.
	- `phone`: Phone calls.
	- `people`: Sub-category used for all nested tags for important people.
		- `Sophie`: Example person with just a first name reference.
		- `Adrian-Romano`: Dashes as separator is the suggested format if you want to include surnames, meaning that you'd type `#context/people/Adrian-Romano`.

If you think that the tags are **too long** despite Obsidian's auto-completon, then feel free to simply shorten the top-level tag categories. Here are some examples of a shorter naming scheme which still retains all the search-benefits of nested tags:

- `#prio/high` => `#p/high`
- `#context/home` => `#c/home`
- `#context/phone` => `#c/phone`
- `#context/people/Adrian-Romano` => `#c/people/Adrian-Romano`

I personally use the shortened syntax, since it reduces visual clutter. This guide just uses the "full syntax" to provide extra clarity for the reader.


### Advanced Usage: Custom Views

It's possible to create your own custom views that call `Next-Tasks` with your own, reusable set of parameters. This is particularly useful if you want to implement your own, advanced presentation-callback and CSS. But it's also very useful if you simply want to reduce the amount of repetitive "default" parameters that you have to type in all of your "dashboard" documents.

Simply create your own "Dataview View" folder, containing a `view.js` and (optionally) a `view.css`. See the official Dataview documentation about custom views if you need more information about the required file structure.

Your custom `view.js` should contain an `await dv.view()` call with a reference to the `Next-Tasks` view-folder, and your desired set of parameters. After that, you can simply use your own view in your "dashboard" documents, and it will take care of calling `Next-Tasks` for you.

Here's an example of a custom `view.js`, which provides a few default parameters (such as assigning the "🔄" emoji as your desired "parallel tasks" keyword), and passes along a custom `search` parameter (to allow you to control the search terms from each individual document).

~~~js
await dv.view("Internal/Views/Next-Tasks", {
	folder: "Tasks/Projects",
	search: input.search,
	show_headers: false,
	//msg_no_tasks: "No tasks.",
	parallel_keyword: "🔄",
	//result_cb: (next_tasks, show_headers) => {
	//	console.log(next_tasks, show_headers);
	//},
});
~~~

Advanced users may even want to implement the `result_cb` to generate your own, specialized display format. See the "Parameters" section for more information about that parameter.

To use your custom view in your documents, you would then simply have to call the path for your custom view. Here's an example of what that might look like.

~~~markdown
```dataviewjs
await dv.view("Internal/Views/My-Custom-View", {
	search: ["#context/online", "#prio/high"],
});
```
~~~

Custom views are also able to include your own CSS (via `view.css`), which makes this feature very powerful if you want to set up advanced views with specialized styling!


Have fun with "Next-Tasks"! // **Bananaman** 🍌


### Website

- https://github.com/Bananaman/Spicy-Obsidian


### License

This project is licensed under the GNU General Public License v3.0 or later.