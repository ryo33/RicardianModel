defmodule RicardianModel.Host do
  alias RicardianModel.Actions
  alias RicardianModel.Main

  def fetch_contents(data) do
    data
    |> Actions.update_host_contents()
  end

  def change_page(data, page) do
    true = page in Main.pages
    %{data | page: page}
    |> Actions.change_page(page)
  end

  def match(data) do
    %{participants: participants} = data
    groups_count = div(Map.size(participants), 2)
    remained = rem(Map.size(participants), 2) == 1
    shuffled = participants
                |> Enum.map(&elem(&1, 0))
                |> Enum.shuffle
    if remained do
      remainder = List.last(shuffled)
      participants = participants
                      |> put_in([remainder, :group], nil)
    end
    users = shuffled
            |> Enum.chunk(2)

    acc = {0, participants, %{}}
    reducer = fn [u1, u2], {group, participants, groups} ->
      group_id = Integer.to_string(group)
      updater = fn participant, group_id ->
        {money, g1rate, g2rate} = Main.generate_country(data)
        %{ participant |
          group: group_id,
          money: money,
          g1rate: g1rate,
          g2rate: g2rate,
          joined: Map.size(data.participants)
        }
      end
      participants = participants
                      |> Map.update!(u1, &updater.(&1, group_id))
                      |> Map.update!(u2, &updater.(&1, group_id))
      groups = Map.put(groups, group_id, Main.new_group(u1, u2))
      {group + 1, participants, groups}
    end
    {_, participants, groups} = Enum.reduce(users, acc, reducer)
    %{data | participants: participants, groups: groups}
    |> Actions.matched()
  end

  # Utilities
  defp range_to_array(first..last), do: [first, last]

  def format_data(data) do
    data
    |> Map.update!(:g1rate, &range_to_array(&1))
    |> Map.update!(:g2rate, &range_to_array(&1))
    |> Map.update!(:money, &range_to_array(&1))
  end
end
