defmodule RicardianModel.Actions do
  alias RicardianModel.Main
  alias RicardianModel.Host
  alias RicardianModel.Participant

  def update_host_contents(data) do
    host = get_action("update contents", Host.format_data(data))
    format(data, host)
  end

  def update_participant_contents(data, id) do
    action = get_action("update contents", Participant.format_contents(data, id))
    format(data, nil, dispatch_to(id, action))
  end

  def update_ranking(data, id) do
    ranking = Enum.map(data.participants, fn {key, %{money: money}} ->
      %{money: money, own: key == id}
    end)
    action = get_action("update ranking", ranking)
    participant = dispatch_to(id, action)
    format(data, nil, participant)
  end

  def update_proposal(data, id, payload) do
    group_id = get_in(data, [:participants, id, :group])
    group = get_in(data, [:groups, group_id])
    target = Main.get_pair(group, id)
    format(data, nil, dispatch_to(target, get_action("change proposal", payload)))
  end

  def proposed(data, id, group_id) do
    group = get_in(data, [:groups, group_id])
    host = get_action("proposed", %{
      "groupID" => group_id,
      state: group.state,
      g1proposal: group.g1proposal,
      g2proposal: group.g2proposal,
    })
    target = Main.get_pair(group, id)
    participant = dispatch_to(target, get_action("proposed", %{
      state: group.state,
      selling: group.selling,
      g1proposal: group.g1proposal,
      g2proposal: group.g2proposal,
    }))
    |> dispatch_to(id, get_action("change state", group.state))
    format(data, host, participant)
  end

  def accept(data, group_id) do
    group = get_in(data, [:groups, group_id])
    u1money = get_in(data, [:participants, group.u1, :money])
    u2money = get_in(data, [:participants, group.u2, :money])
    host = get_action("accepted", %{
      "groupID" => group_id,
      state: group.state,
      u1money: u1money,
      u2money: u2money,
      round: group.round,
    })
    participant = dispatch_to(group.u1, get_action("accepted", %{
      state: group.state,
      round: group.round,
      money: u1money,
      selling: group.selling
    }))
    |> dispatch_to(group.u2, get_action("accepted", %{
      state: group.state,
      round: group.round,
      money: u2money,
      selling: group.selling
    }))
    format(data, host, participant)
  end

  def reject(data, group_id) do
    group = get_in(data, [:groups, group_id])
    host = get_action("change state", %{
      "groupID" => group_id,
      state: group.state,
    })
    action = get_action("rejected", %{state: group.state})
    participant = dispatch_to(group.u1, action)
    |> dispatch_to(group.u2, action)
    format(data, host, participant)
  end

  def change_page(data, page) do
    action = get_action("change page", page)
    format(data, nil, dispatch_to_all(data, action))
  end

  def join(data, id, participant) do
    action = get_action("join", %{id: id, user: participant})
    format(data, action)
  end

  def matched(data) do
    %{participants: participants, groups: groups} = data
    host = get_action("matched", %{participants: participants, groups: groups})
    participant = Enum.map(participants, fn {id, p} ->
      payload = if is_nil(p.group) do
        Participant.format_participant(p)
      else
        Map.merge(Participant.format_participant(p), Participant.format_group(data, Map.get(groups, p.group), id))
      end
      {id, %{action: get_action("matched", payload)}}
    end) |> Enum.into(%{})
    format(data, host, participant)
  end

  def change_goods(data, id, group_id) do
    group = Participant.get_group(data, group_id)
    action = get_action("change goods", group.selling)
    target = Main.get_pair(group, id)
    participant = dispatch_to(target, action)
    format(data, nil, participant)
  end

  # Utilities

  defp get_action(type, params) do
    %{
      type: type,
      payload: params
    }
  end

  defp dispatch_to(map \\ %{}, id, action) do
    Map.put(map, id, %{action: action})
  end

  defp dispatch_to_all(%{participants: participants}, action) do
    Enum.reduce(participants, %{}, fn {id, _}, acc -> dispatch_to(acc, id, action) end)
  end

  defp format(data, host, participants \\ %{}) do
    result = %{"data" => data}
    unless is_nil(host) do
      result = Map.put(result, "host", %{action: host})
    end
    unless is_nil(participants) do
      result = Map.put(result, "participant", participants)
    end
    {:ok, result}
  end
end
